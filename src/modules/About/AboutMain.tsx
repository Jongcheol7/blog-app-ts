"use client";

import { Github, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-gray-800">
      {/* 1️⃣ 프로필 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center space-y-4"
      >
        <img
          src="/profile.jpg"
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover shadow-md border border-gray-200"
        />
        <h1 className="text-3xl font-semibold">Jongcheol Lee</h1>
        <p className="text-gray-500 text-sm">
          Developer who keeps learning and recording 🌿
        </p>
      </motion.section>

      {/* 2️⃣ 소개 섹션 */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 space-y-10 leading-relaxed"
      >
        {/* About Me */}
        <div>
          <h2 className="text-xl font-semibold mb-3">👋 About Me</h2>
          <p className="text-gray-700">
            안녕하세요. 매일 조금씩 배우고 성장하고 싶은 개발자, 종철입니다.
            <br />
            <br />
            개발을 공부하면서 매번 검색하고 또 잊어버리던 내용들을 제 방식대로
            정리해두고 싶어 블로그를 시작했어요. 이곳은 저의 기록이자, 언젠가
            저처럼 같은 길을 걷는 누군가에게 작은 도움이 될 수 있는 공간이
            되었으면 합니다.
          </p>
        </div>

        {/* What I Do */}
        <div>
          <h2 className="text-xl font-semibold mb-3">💻 What I Do</h2>
          <p className="text-gray-700">
            평일에는 Java와 Spring을 사용하는 SI/SM 프로젝트에서 일하고 있고,
            퇴근 후에는 프론트엔드 공부와 개인 프로젝트를 통해 새로운 기술을
            배우며 성장하고 있습니다.
            <br />
            Next.js, TypeScript, React Query 등을 활용해 제가 직접 설계하고
            만들어가는 과정을 즐기고 있어요.
          </p>
        </div>

        {/* My Values */}
        <div>
          <h2 className="text-xl font-semibold mb-3">🌱 My Values</h2>
          <p className="text-gray-700">
            완벽하지 않아도 괜찮다고 믿습니다. 중요한 건, 어제보다 오늘
            조금이라도 나아지는 것.
            <br />
            개발도, 인생도 결국은 꾸준히 쌓이는 기록이라고 생각해요. 그래서 저는
            오늘도 천천히, 하지만 멈추지 않고 나아가려 합니다.
          </p>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="flex justify-center gap-6 mt-16 text-gray-500"
      >
        <a
          href="https://github.com/Jongcheol7"
          target="_blank"
          rel="noreferrer"
          className="hover:text-black transition"
        >
          <Github className="w-6 h-6" />
        </a>
        <a
          href="mailto:whdcjf8172@gmail.com"
          className="hover:text-black transition"
        >
          <Mail className="w-6 h-6" />
        </a>
        {/* <a
          href="https://linkedin.com"
          target="_blank"
          rel="noreferrer"
          className="hover:text-black transition"
        >
          <Linkedin className="w-6 h-6" />
        </a> */}
      </motion.section>
    </div>
  );
}
