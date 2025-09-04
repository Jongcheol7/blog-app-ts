import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutMain() {
  return (
    <main className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* About */}
      <section>
        <h1 className="text-2xl font-bold mb-4">다시 시작한 개발자의 길</h1>
        <p className="text-muted-foreground leading-relaxed mb-3">
          ERP 유지보수 업무를 맡으며 <b>Java</b>, <b>Spring</b>, <b>Oracle</b>,{" "}
          <b>WebSquare</b> 중심의 개발 경험을 쌓았습니다. 하지만 반복되는 일상과
          투자 실패를 겪으며 제 커리어를 돌아보게 되었고, “눈앞에 보이는 결과를
          직접 만들고 싶다”는 마음으로 <b>프론트엔드 개발</b>에 집중하게
          되었습니다.
        </p>
        <p className="text-muted-foreground leading-relaxed mb-3">
          퇴근 후 독학으로 <b>React.js</b>, <b>Next.js</b>, <b>TypeScript</b>,{" "}
          <b>JavaScript</b>를 학습하며 웹 애플리케이션을 직접 만들었습니다. 작은
          프로젝트를 완성해 가는 과정에서, 단순한 기능 구현을 넘어{" "}
          <b>사용자 경험을 설계하고 문제를 해결하는 즐거움</b>을 다시 찾을 수
          있었습니다.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          앞으로도 꾸준히 배우고 적용하며, 더 나은 결과물을 만들어가는 개발자로
          성장해 나가고자 합니다.
        </p>
      </section>

      {/* Tech Stack */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Tech Stack</h2>
        <div className="grid gap-4 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Frontend</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {[
                "React.js",
                "Next.js",
                "TypeScript",
                "JavaScript",
                "Tailwind",
                "shadcn/ui",
              ].map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">State & Data</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {["React Query", "Zustand"].map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Backend</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {["Node.js", "Prisma", "PostgreSQL"].map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Infra & Tools</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {[
                "AWS (S3, CloudFront)",
                "Supabase",
                "Mux",
                "GitHub Actions",
              ].map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Editors & UI</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              {["Tiptap", "CKEditor", "Lexical"].map((t) => (
                <Badge key={t} variant="secondary">
                  {t}
                </Badge>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Projects */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Projects</h2>
        <div className="space-y-6">
          <div>
            <h3 className="font-medium">📌 Blog Platform</h3>
            <p className="text-sm text-muted-foreground">
              Stack: Next.js, Prisma, NextAuth, PostgreSQL, Tailwind, shadcn/ui,
              Tiptap
            </p>
            <p className="text-sm">
              Features: 글 작성/수정/삭제, 댓글, 카테고리, 다크모드, 이미지
              업로드 (S3 + CloudFront)
            </p>
            <p className="text-sm">
              Focus: 사용자 친화적인 마크다운 에디터와 퍼포먼스 최적화
            </p>
          </div>
          <div>
            <h3 className="font-medium">📌 Note App</h3>
            <p className="text-sm text-muted-foreground">
              Stack: Next.js, Prisma, PostgreSQL, Zustand, React Query, Tiptap
            </p>
            <p className="text-sm">
              Features: 노트 CRUD, 무한 스크롤, 카테고리 관리, 알림 캘린더
            </p>
            <p className="text-sm">
              Focus: 상태 관리(Zustand)와 비동기 데이터 처리(React Query) 최적화
            </p>
          </div>
          <div>
            <h3 className="font-medium">📌 Currency Exchange App</h3>
            <p className="text-sm text-muted-foreground">
              Stack: Next.js, TypeScript, React Query, Prisma, Supabase
            </p>
            <p className="text-sm">
              Features: 실시간 환율 조회, 차트, 오프라인 캐싱, 위치 기반 환전소
              검색
            </p>
            <p className="text-sm">
              Focus: 실시간 데이터 처리와 사용자 편의 기능 강화
            </p>
          </div>
          <div>
            <h3 className="font-medium">📌 Social Media App (진행중)</h3>
            <p className="text-sm text-muted-foreground">
              Stack: Next.js, Clerk, Drizzle, Neon, Mux, shadcn/ui
            </p>
            <p className="text-sm">
              Features: 회원 인증, 게시물 업로드, 동영상 스트리밍, 실시간 채팅
            </p>
            <p className="text-sm">
              Focus: 대규모 사용자 경험을 고려한 소셜 기능 구현
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
