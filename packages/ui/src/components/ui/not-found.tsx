const MESSAGES = [
  "We sniffed around but couldn't find your bone. Are you sure it's buried here?",
  "This page must have gone on a walk without a leash. We can't find it!",
  "Our server played fetch, but the page you're looking for didn't come back.",
  "You've caught the scent of a page that's lost in the woods. No tracks here!",
  "Looks like the cat's got this page! We can't find it anywhere.",
  "This page is having a cat nap. We can't find it anywhere!",
];

export default function NotFound() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center">
      <span className="text-center text-[3rem] font-medium text-primary">
        Oops...
      </span>
      {/* <NotFoundAnimation /> */}
      <div className="px-3 text-center text-xl font-semibold">
        {MESSAGES[Math.floor(Math.random() * MESSAGES.length)]}
      </div>
    </div>
  );
}
