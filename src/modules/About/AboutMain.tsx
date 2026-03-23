"use client";

import { Github, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16 text-foreground">
      {/* Profile */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col items-center text-center space-y-4"
      >
        <img
          src="/profile.jpg"
          alt="Profile"
          className="w-36 h-36 rounded-2xl object-cover shadow-lg ring-4 ring-background"
        />
        <h1 className="text-4xl font-bold tracking-tight">Jongcheol Lee</h1>
        <p className="text-muted-foreground text-base font-light">
          Developer who keeps learning and recording
        </p>
      </motion.section>

      {/* About sections */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="mt-16 space-y-12 leading-relaxed"
      >
        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            About Me
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            안녕하세요. 매일 조금씩 배우고 성장하고 싶은 개발자, 종철입니다.
            <br />
            <br />
            개발을 공부하면서 매번 검색하고 또 잊어버리던 내용들을 제 방식대로
            정리해두고 싶어 블로그를 시작했어요. 이곳은 저의 기록이자, 언젠가
            저처럼 같은 길을 걷는 누군가에게 작은 도움이 될 수 있는 공간이
            되었으면 합니다.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            What I Do
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
            평일에는 Java와 Spring을 사용하는 SI/SM 프로젝트에서 일하고 있고,
            퇴근 후에는 프론트엔드 공부와 개인 프로젝트를 통해 새로운 기술을
            배우며 성장하고 있습니다.
            <br />
            Next.js, TypeScript, React Query 등을 활용해 제가 직접 설계하고
            만들어가는 과정을 즐기고 있어요.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4 text-foreground">
            My Values
          </h2>
          <p className="text-muted-foreground leading-relaxed text-base">
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
        className="flex justify-center gap-4 mt-16"
      >
        <a
          href="https://github.com/Jongcheol7"
          target="_blank"
          rel="noreferrer"
          className="p-3 rounded-full bg-secondary hover:bg-accent hover:text-primary transition-all text-muted-foreground"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href="mailto:whdcjf8172@gmail.com"
          className="p-3 rounded-full bg-secondary hover:bg-accent hover:text-primary transition-all text-muted-foreground"
        >
          <Mail className="w-5 h-5" />
        </a>
      </motion.section>
    </div>
  );
}
