import { FamilyVideo } from '@/data/familyVideos';

interface FamilyVideosProps {
  videos: FamilyVideo[];
}

/**
 * FamilyVideos Component
 *
 * Grid of home movies. Uses native video controls with preload="none" so
 * nothing downloads until a visitor presses play.
 */
export default function FamilyVideos({ videos }: FamilyVideosProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {videos.map((video) => (
        <figure
          key={video.id}
          className="rounded-xl overflow-hidden bg-space-800/50 border border-space-700"
        >
          <video
            controls
            preload="none"
            poster={video.poster}
            className="w-full aspect-[4/3] bg-black"
          >
            <source src={video.src} type="video/mp4" />
          </video>
          <figcaption className="p-3 sm:p-4">
            <p className="text-space-100 font-medium">{video.title}</p>
            <p className="text-space-400 text-sm mt-1">
              {[video.location, video.date, video.duration].filter(Boolean).join(' · ')}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
