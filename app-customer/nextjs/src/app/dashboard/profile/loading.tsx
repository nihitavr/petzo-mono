import UserProfileLoading from "../_components/user-profile-loading";

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <div className="p-5">
      <UserProfileLoading />
    </div>
  );
}
