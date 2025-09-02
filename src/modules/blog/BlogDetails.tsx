"use client";
import { useBlogDetails } from "@/hooks/useBlogDetails";
import CategoryMain from "./CategoryMain";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Editor from "../common/Editor";
import { useState } from "react";
import CommentForm from "../common/CommentForm";
import CommentLists from "../common/CommentLists";

export default function BlogDetails({ id }: { id: string }) {
  const { data } = useBlogDetails(Number(id));
  const [editor, setEditor] = useState(null);
  const router = useRouter();
  console.log("BlogDetails 의 data : ", data);
  return (
    <>
      {data && (
        <div className="flex flex-col gap-2">
          <div className="flex">
            <div className="flex flex-1 items-center">
              <CategoryMain
                category={data.details.categoryId}
                setCategory={() => {}}
                readYn={true}
              />
              <div className="flex items-center ml-5">
                <label htmlFor="privateYn" className="w-[100px] text-gray-600">
                  비밀글 설정
                </label>
                <input
                  id="privateYn"
                  type="checkbox"
                  defaultChecked={data.details.privateYn}
                  readOnly
                />
              </div>
            </div>
            <Button
              variant={"custom"}
              onClick={() => router.push(`/edit/${id}`)}
            >
              수정
            </Button>
          </div>
          <input
            className="border-none shadow-none font-bold h-10 text-2xl rounded-xl px-1"
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
