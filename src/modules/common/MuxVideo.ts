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
        renderHTML: (attrs) => {
          if (!attrs.playbackId) return {};
          return { "playback-id": attrs.playbackId };
        },
      },
      tempId: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-temp-id"), // ✅ 추가
        renderHTML: (attrs) => {
          if (!attrs.tempId) return {};
          return { "data-temp-id": attrs.tempId }; // ✅ 추가
        },
      },
    };
  },

  // DB string에서 <mux-player> 태그를 만나면 내 노드로 인식
  parseHTML() {
    return [{ tag: "mux-player" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "mux-player",
      {
        ...HTMLAttributes,
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
