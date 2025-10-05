"use client";
import { useBlogDetails } from "@/hooks/useBlogDetails";
import CategoryMain from "../Category/CategoryMain";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Editor from "../common/Editor";
import { useState } from "react";
import CommentForm from "../Comment/CommentForm";
import CommentLists from "../Comment/CommentLists";
import { useSession } from "next-auth/react";
import LabelCheckbox from "../common/LabelCheckbox";

export default function BlogDetails({ id }: { id: string }) {
  const { data } = useBlogDetails(Number(id));
  const { data: session } = useSession();
  const [, setEditor] = useState(null);
  const router = useRouter();
  const isAdmin = session?.user.isAdmin;

  return (
    <>
      {data && data.details && (
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex">
            <div className="flex flex-1 items-center">
              <CategoryMain
                category={data.details.categoryId}
                setCategory={() => {}}
                readYn={true}
              />
              <div className="flex items-center ml-5 gap-3">
                <LabelCheckbox
                  label={"Private"}
                  id={"privateYn"}
                  isDisabled={true}
                  defaultVal={data.details.privateYn}
                />
                <LabelCheckbox
                  label={"Main"}
                  id={"pinnedYn"}
                  isDisabled={true}
                  defaultVal={data.details.pinnedYn}
                />
              </div>
            </div>
            {isAdmin && (
              <Button onClick={() => router.push(`/edit/${id}`)}>수정</Button>
            )}
          </div>
          <input
            className="border-none shadow-none font-bold h-10 text-2xl rounded-xl px-1 focus:outline-none"
            placeholder="제목을 입력하세요"
            value={data.details.title}
            readOnly
          />
          {/* Editor 영역 */}
          <div className="flex-1 rounded-sm p-1 h-[300px]">
            <Editor
              setEditor={setEditor}
              content={data.details.content}
              readOnly={true}
            />
          </div>
          <CommentForm blogId={data.details.id} />
          <CommentLists blogId={data.details.id} />
        </div>
      )}
    </>
  );
}
