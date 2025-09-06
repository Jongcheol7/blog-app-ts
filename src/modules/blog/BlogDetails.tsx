"use client";
import { useBlogDetails } from "@/hooks/useBlogDetails";
import CategoryMain from "./CategoryMain";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Editor from "../common/Editor";
import { useState } from "react";
import CommentForm from "../common/CommentForm";
import CommentLists from "../common/CommentLists";

export default function BlogDetails({ id }: { id: string }) {
  const { data } = useBlogDetails(Number(id));
  const [, setEditor] = useState(null);
  const router = useRouter();
  console.log("BlogDetails 의 data : ", data);
  return (
    <>
      {data && (
        <div className="flex flex-col gap-2 mt-3">
          <div className="flex">
            <div className="flex flex-1 items-center">
              <CategoryMain
                category={data.details.categoryId}
                setCategory={() => {}}
                readYn={true}
              />
              <div className="flex items-center ml-5 gap-3">
                <div>
                  <label htmlFor="privateYn" className="text-gray-600 mr-1">
                    비밀글 설정
                  </label>
                  <input
                    id="privateYn"
                    type="checkbox"
                    defaultChecked={data.details.privateYn}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="pinnedYn" className="text-gray-600 mr-1">
                    메인고정
                  </label>
                  <input
                    id="pinnedYn"
                    type="checkbox"
                    defaultChecked={data.details.pinnedYn}
                    disabled
                  />
                </div>
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
