"use client";
import MuxPlayer from "@mux/mux-player-react";
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react";

export default function MuxPlayerNodeView({ node }: NodeViewProps) {
  const playbackId = node.attrs.playbackId;
  const isTemp =
    typeof playbackId === "string" && playbackId.startsWith("__TEMP_VIDEO_");

  return (
    <NodeViewWrapper className="mux-player-wrapper">
      {isTemp ? (
        <div className="w-full h-[300px] flex items-center justify-center bg-gray-200 text-gray-600 text-sm rounded">
          📹 저장 후 실행 가능합니다
        </div>
      ) : !playbackId ? (
        <div className="w-full h-[300px] flex items-center justify-center bg-red-200 text-red-600 text-sm rounded">
          ⚠️ 재생할 수 없는 비디오
        </div>
      ) : (
        <MuxPlayer
          streamType="on-demand"
          playbackId={playbackId}
          autoPlay={false}
          style={{ width: "100%", height: "400px", maxHeight: "400px" }}
        />
      )}
    </NodeViewWrapper>
  );
}
