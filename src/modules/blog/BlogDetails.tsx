"use client";
import { useBlogDetails } from "@/hooks/useBlogDetails";
import CategoryMain from "./CategoryMain";
import { Input } from "@/components/ui/input";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function BlogDetails({ id }: { id: string }) {
  const { data } = useBlogDetails(Number(id));
  const router = useRouter();

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
          <Input
            placeholder="제목을 입력하세요"
            value={data.details.title}
            readOnly
          />

          <Card>
            <CardContent>
              <Viewer initialValue={data.details.content || ""} />
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
