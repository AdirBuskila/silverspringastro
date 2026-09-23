"""
Parse the original site's per-image pages (e.g. galaxies/images/M100_LRGB_BBO.htm,
recovered from the Wayback Machine) into src/data/captureDetails.ts.

Each page has a header like
    <font size="5">M74</font> in Psc - RA = 01h36.7m  DC = +15°47' (J2000)
and a caption cell like
    LRGB from BlackBird Observatory - NM (H08)<br />
    0.51-m f/8.26 Ritchey-Chretien + 4008x2672 CCD<br />
    2006/12/24 LRGB=300:60:36:72 min<br />
    (joint imaging with Josch Hambsch)

Usage: python parse_capture_details.py <pages_dir>
Page files are named <section>__<ImageBase>.htm; *_full.htm variants fill gaps.
"""

import html
import json
import re
import sys
from pathlib import Path

OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "captureDetails.ts"

# Constellation abbreviations used on the original pages
CONSTELLATIONS = {
    "And": "Andromeda", "Aqr": "Aquarius", "Ari": "Aries", "Boo": "Boötes", "Cam": "Camelopardalis",
    "Cnc": "Cancer", "CVn": "Canes Venatici", "Cas": "Cassiopeia", "Cep": "Cepheus", "Cet": "Cetus",
    "Com": "Coma Berenices", "Cyg": "Cygnus", "Dra": "Draco", "Eri": "Eridanus", "Gem": "Gemini",
    "Her": "Hercules", "Leo": "Leo", "LMi": "Leo Minor", "Lyn": "Lynx", "Lyr": "Lyra", "Mon": "Monoceros",
    "Oph": "Ophiuchus", "Ori": "Orion", "Peg": "Pegasus", "Per": "Perseus", "Psc": "Pisces",
    "Sgr": "Sagittarius", "Scl": "Sculptor", "Ser": "Serpens", "Tau": "Taurus", "Tri": "Triangulum",
    "UMa": "Ursa Major", "Vir": "Virgo", "Vul": "Vulpecula",
}

# Supernova pages on the old site share a template line ("2005/05/14 RGB=20:20:20 min")
# that predates some of the discoveries, so it can't be trusted for these objects.
TEMPLATED_LINE = "2005/05/14 RGB=20:20:20 min"

EXPOSURE_LINE = re.compile(r"(\d{4})/(\d{2})/(\d{2})\s+([A-Za-z]+)\s*[=:]\s*([\d:.]+)\s*min")


def text_of(fragment: str) -> str:
    fragment = re.sub(r"<[^>]+>", " ", fragment)
    return re.sub(r"\s+", " ", html.unescape(fragment)).strip()


def parse_page(raw: str) -> dict | None:
    if "One moment, please" in raw or "<th" not in raw:
        return None

    details: dict = {}
    header = re.search(r'<th[^>]*width="74%"[^>]*>(.*?)</th>', raw, re.S | re.I)
    if header:
        h = text_of(header.group(1)).replace("�", "°")
        m = re.search(r"RA\s*=\s*([\dhm.]+)\s+DC\s*=\s*([+\-]?[\d°'\"]+)", h)
        if m:
            details["ra"] = m.group(1)
            details["dec"] = m.group(2)
        ctx = re.search(r"^\S+\s+in\s+(\S+)\s+-", h)
        if ctx:
            word = ctx.group(1)
            details["context"] = CONSTELLATIONS.get(word, re.sub(r"^(NGC|UGC|IC)(\d)", r"\1 \2", word))

    caption = None
    for cell in re.findall(r'<td[^>]*colspan="3"[^>]*>(.*?)</td>', raw, re.S | re.I):
        if "<img" not in cell.lower():
            caption = cell
            break
    if caption is None:
        return details or None

    links = [
        {"label": text_of(label), "url": url}
        for url, label in re.findall(r'<a[^>]+href="(https?://[^"]+)"[^>]*>(.*?)</a>', caption, re.S | re.I)
    ]
    if links:
        details["links"] = links
    caption = re.sub(r"<a[^>]*>.*?</a>", "", caption, flags=re.S | re.I)
    lines = [text_of(part) for part in re.split(r"<br\s*/?>", caption, flags=re.I)]

    for line in filter(None, lines):
        if " from " in line and "Observatory" in line:
            continue  # "LRGB from Silver Spring Observatory - MD (H85)" is already in the image record
        rig = re.match(r"(.+?)\s*\+\s*(\d+x\d+ CCD.*)$", line)
        if rig:
            scope = re.sub(r"\bRC$", "Ritchey-Chretien", rig.group(1))
            details["telescope"] = scope.replace("Chretien", "Chrétien")
            details["camera"] = rig.group(2)
            continue
        if line == TEMPLATED_LINE:
            continue
        exp = EXPOSURE_LINE.match(line)
        if exp:
            details["date"] = f"{exp.group(1)}-{exp.group(2)}-{exp.group(3)}"
            details["exposures"] = split_exposures(exp.group(4), exp.group(5))
            continue
        if re.match(r"\d{4}/\d{2}/\d{2}", line):
            continue  # truncated exposure line (some *_full pages were cut off)
        if line.startswith("(") and line.endswith(")"):
            line = line[1:-1]
        details.setdefault("notes", []).append(line.strip())

    return details or None


def split_exposures(filters: str, values: str) -> list[dict]:
    """'LRGB', '300:60:36:72' -> L/R/G/B minutes. 'RGB' with four values is read as L:R:G:B."""
    names = re.findall(r"Ha|OIII|SII|[LRGBV]", filters)
    mins = [float(v) for v in values.split(":") if v]
    if len(mins) == len(names) + 1 and names == ["R", "G", "B"]:
        names = ["L", "R", "G", "B"]
    if len(mins) != len(names):
        names = [f"{filters} {i + 1}" for i in range(len(mins))]
    return [{"filter": n, "minutes": int(m) if m.is_integer() else m} for n, m in zip(names, mins)]


def main(pages_dir: str) -> None:
    results: dict[str, dict] = {}
    # Regular pages first, then *_full pages only fill in missing fields
    files = sorted(Path(pages_dir).glob("*.htm"), key=lambda p: (p.stem.endswith("_full"), p.stem))
    for path in files:
        base = path.stem.split("__", 1)[1]
        is_full = base.endswith("_full")
        base = base.removesuffix("_full")
        parsed = parse_page(path.read_text(encoding="latin-1"))
        if not parsed:
            continue
        if is_full and base in results:
            for k, v in parsed.items():
                results[base].setdefault(k, v)
        else:
            results[base] = parsed

    body = json.dumps(dict(sorted(results.items())), indent=2, ensure_ascii=False)
    # Keep each exposure / link on one line
    body = re.sub(r'\{\s+("(?:filter|label)": .+),\s+("(?:minutes|url)": .+?)\s+\}', r"{ \1, \2 }", body)
    OUT.write_text(
        "/**\n"
        " * Capture details recovered from the original silverspringastro.com per-image pages\n"
        " * (via the Wayback Machine). Keyed by image file name without extension.\n"
        " * Generated by scraper/parse_capture_details.py; edit by hand for corrections.\n"
        " */\n\n"
        "import { CaptureDetails } from '@/lib/types';\n\n"
        f"export const captureDetails: Record<string, CaptureDetails> = {body};\n",
        encoding="utf-8",
    )
    print(f"wrote {len(results)} entries to {OUT}")


if __name__ == "__main__":
    main(sys.argv[1])
