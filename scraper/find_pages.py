import requests

BASE = "https://silverspringastro.com"

# Try different URL patterns
urls = [
    "galaxyclusters.htm",
    "galaxyclusters.html", 
    "galaxy_clusters.htm",
    "GalaxyClusters.htm",
    "Galaxy_Clusters.htm",
    "galaxycluster.htm",
    "starclusters.htm",
    "starclusters.html",
    "star_clusters.htm", 
    "StarClusters.htm",
    "Star_Clusters.htm",
    "starcluster.htm",
    "index.htm",
    "index.html",
    "galaxies.htm",
    "Galaxies.htm",
    "nebulae.htm",
    "Nebulae.htm",
]

for u in urls:
    try:
        r = requests.head(f"{BASE}/{u}", timeout=5)
        print(f"{u}: {r.status_code}")
    except Exception as e:
        print(f"{u}: ERROR - {e}")

