import GuestbookForm from "./GuestbookForm";
import GuestbookLists from "./GuestbookLists";

export default function GuestbookMain() {
  return (
    <div>
      <h1>게스트북 페이지</h1>
      <GuestbookForm />
      <GuestbookLists />
    </div>
  );
}
