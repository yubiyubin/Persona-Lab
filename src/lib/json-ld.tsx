/**
 * JSON-LD 구조화 데이터 삽입 컴포넌트
 *
 * Server Component에서 사용 가능. XSS 방지를 위해 `<` 문자를 이스케이프한다.
 */

type JsonLdProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any>;
};

export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
