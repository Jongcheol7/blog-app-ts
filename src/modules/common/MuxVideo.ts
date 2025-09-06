import { Node } from "@tiptap/core";
import { ReactNodeViewRenderer } from "@tiptap/react";
import MuxPlayerNodeView from "./MuxPlayerNodeView";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    muxVideo: {
      insertMuxVideo: (playbackId: string) => ReturnType;
    };
  }
}

export const MuxVideo = Node.create({
  name: "muxVideo",
  group: "block",
  atom: true,
  draggable: true,

  addAttributes() {
    return {
      playbackId: {
        default: null,
        parseHTML: (el) => el.getAttribute("playback-id"),
        renderHTML: (attrs) => ({ "playback-id": attrs.playbackId }),
      },
      tempId: { default: null },
    };
  },

  // DB string에서 <mux-player> 태그를 만나면 내 노드로 인식
  parseHTML() {
    return [{ tag: "mux-player" }];
  },

  renderHTML({ HTMLAttributes }) {
    // 저장 전 → placeholder div
    if (HTMLAttributes.tempId) {
      return [
        "div",
        { "data-temp-video": "true", "data-temp-id": HTMLAttributes.tempId },
        "📹 저장 후 실행 가능합니다",
      ];
    }
    // 저장 후에는 그냥 mux-player 태그 그대로 출력 (DB 저장용)
    return [
      "mux-player",
      {
        "playback-id": HTMLAttributes.playbackId,
        "stream-type": "on-demand",
        controls: "true",
        contenteditable: "false",
      },
    ];
  },

  addCommands() {
    return {
      insertMuxVideo:
        (tempId: string) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: { tempId },
          });
        },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(MuxPlayerNodeView);
  },
});
