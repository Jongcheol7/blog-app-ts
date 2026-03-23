import GuestbookForm from "./GuestbookForm";
import GuestbookLists from "./GuestbookLists";

export default function GuestbookMain() {
  return (
    <div className="py-8 space-y-6">
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Guestbook</h1>
        <p className="text-muted-foreground">
          Leave a message — I would love to hear from you.
        </p>
      </div>
      <GuestbookForm />
      <GuestbookLists />
    </div>
  );
}
