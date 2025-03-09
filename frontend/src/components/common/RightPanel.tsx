import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeleton/RightPanelSkeleton.tsx";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../../hooks/useFollow.tsx";
import LoadingSpinner from "./LoadingSpinner.tsx";

const RightPanel = () => {
  const { data: suggestedUsers, isLoading } = useQuery({
    queryKey: ["suggestedUsers"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/users/suggested");
        if (!res.ok) {
          throw new Error("Failed to fetch suggested users");
        }
        const data = await res.json();
        if (data.error) {
          throw new Error(data.error);
        }
        console.log("Suggested users fetched:", data);
        return data;
      } catch (err) {
        console.error(err);
        throw new Error("Failed to fetch suggested users");
      }
    },
  });

  if (suggestedUsers?.length === 0) return <div className="md:w-64 w-0"></div>;


  const {followUnfollow , isPending} = useFollow();
 // the main container will be 64px wide on mobile screens
  return (
    <div className="hidden lg:block my-4 mx-2">
      <div className="bg-[#16181C] p-4 rounded-md sticky top-2">
        <p className="font-bold">Who to follow</p>
        <div className="flex flex-col gap-4">
          {/* item */}
          {isLoading && (
            <>
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
              <RightPanelSkeleton />
            </>
          )}
          {!isLoading &&
            suggestedUsers?.map((user) => (
              <Link
                to={`/profile/${user.username}`}
                className="flex items-center justify-between gap-4"
                key={user._id}
              >
                <div className="flex gap-2 items-center">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img src={user.profileImg || "/avatar-placeholder.png"} />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold tracking-tight truncate w-28">
                      {user.fullname}
                    </span>
                    <span className="text-sm text-slate-500">
                      @{user.username}
                    </span>
                  </div>
                </div>
                <div>
                  <button
                    className="btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm"
                    onClick={(e) => {
                      e.preventDefault();
                      followUnfollow(user._id);
                    }}
                  >
                    {isPending  ? <LoadingSpinner size="sm"/> : "Follow"}
                    
                  </button>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};
export default RightPanel;
