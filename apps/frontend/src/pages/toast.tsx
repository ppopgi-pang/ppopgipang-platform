import { createFileRoute } from "@tanstack/react-router";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/common/button/button";

export const Route = createFileRoute("/toast")({
  component: RouteComponent,
});

function RouteComponent() {
  const toast = useToast();

  return (
    <div className="min-h-screen bg-background-secondary p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-text-primary mb-8">
          Toast 예시
        </h1>

        <div className="bg-white rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            기본 Toast 타입
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* <Button
              variant="primary"
              onClick={() => toast.success("저장되었습니다!")}
            >
              Success Toast
            </Button> */}

            {/* <Button
              variant="destructive"
              onClick={() => toast.error("에러가 발생했습니다.")}
            >
              Error Toast
            </Button> */}

            <Button
              variant="secondary"
              onClick={() => toast.warning("주의가 필요합니다.")}
            >
              Warning Toast
            </Button>

            <Button
              variant="tertiary"
              onClick={() => toast.info("새로운 정보가 있습니다.")}
            >
              Info Toast
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            지속 시간 커스터마이징
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="primary"
              onClick={() => toast.success("1초 후 사라집니다", 1000)}
            >
              1초 Toast
            </Button>

            <Button
              variant="primary"
              onClick={() => toast.success("5초 후 사라집니다", 5000)}
            >
              5초 Toast
            </Button>

            <Button
              variant="primary"
              onClick={() => toast.success("10초 후 사라집니다", 10000)}
            >
              10초 Toast
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            여러 Toast 동시 표시
          </h2>
          <Button
            variant="primary"
            onClick={() => {
              toast.success("첫 번째 메시지");
              setTimeout(() => toast.info("두 번째 메시지"), 200);
              setTimeout(() => toast.warning("세 번째 메시지"), 400);
              setTimeout(() => toast.error("네 번째 메시지"), 600);
            }}
          >
            여러 Toast 한번에 표시
          </Button>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-md mt-6">
          <h2 className="text-xl font-semibold mb-4 text-text-primary">
            실제 사용 예시
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2 text-text-secondary">
                폼 제출 시뮬레이션
              </h3>
              <Button
                variant="primary"
                onClick={() => {
                  toast.info("데이터를 저장하는 중...");
                  setTimeout(() => {
                    toast.success("데이터가 성공적으로 저장되었습니다!");
                  }, 2000);
                }}
              >
                폼 제출
              </Button>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-text-secondary">
                에러 처리
              </h3>
              <Button
                variant="destructive"
                onClick={() => {
                  toast.error("네트워크 연결을 확인해주세요.", 3000);
                }}
              >
                에러 발생
              </Button>
            </div>

            <div>
              <h3 className="font-medium mb-2 text-text-secondary">
                알림 메시지
              </h3>
              <Button
                variant="secondary"
                onClick={() => {
                  toast.warning("이 작업은 되돌릴 수 없습니다.", 3000);
                }}
              >
                경고 표시
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
