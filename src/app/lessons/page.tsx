import Link from "next/link";
export default function LessonsPage() {
  const lessons = [
    { id: "01-basic" },
    { id: "02-geometry" },
    { id: "03-modalobject" },
    { id: "04-hierarchical-model" },
    { id: "05-uv-coordinates" },
    { id: "06-loadgltf" },
    // 添加更多课程...
  ];

  return (
    <div>
      <h1 className=" font-bold text-4xl mb-4">Lessons</h1>
      <ul>
        {lessons.map((lesson) => (
          <li key={lesson.id} className=" font-bold text-sky-600">
            <Link href={`/lessons/${lesson.id}`}>{lesson.id}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
