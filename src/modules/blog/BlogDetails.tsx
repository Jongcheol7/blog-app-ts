"use client";
import { useBlogDetails } from "@/hooks/useBlogDetails";
import CategoryMain from "./CategoryMain";
import { Input } from "@/components/ui/input";
import ImagePicker from "../common/ImagePicker";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import { Card, CardContent } from "@/components/ui/card";

export default function BlogDetails({ id }: { id: string }) {
  const { data } = useBlogDetails(Number(id));

  console.log("상세조회 결과 : ", data);
  return (
    <>
      {data && (
        <div className="flex flex-col gap-2">
          <div className="flex flex-1">
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
          <Input
            placeholder="제목을 입력하세요"
            value={data.details.title}
            readOnly
          />

          {/* 썸네일 */}
          {/* <ImagePicker
            pickedImage={data.details.imageUrl}
            setPickedImage={() => {}}
            readYn={true}
          /> */}

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

{
  /* <div className="flex flex-col flex-1">
        <div className="flex flex-wrap gap-2 mt-2">
          {dataList.map((tag) => (
            <span
              key={tag}
              className="flex items-center bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm hover:bg-red-300 transition-all"
            >
              # {tag}
            </span>
          ))}
        </div>
      </div> */
}
