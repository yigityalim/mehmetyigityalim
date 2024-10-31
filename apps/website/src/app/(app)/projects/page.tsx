import { Container } from "@/components/container";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardDescription,
  CardTitle,
} from "@myy/ui/card";

export default function ProjectsPage() {
  return (
    <Container title="Projelerim">
      <div className="w-full grid grid-cols-1 gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id}>
            <CardHeader>
              <img
                src={`/images/projects/${project.image}`}
                alt={project.title}
              />
            </CardHeader>
            <CardContent>
              <CardTitle>{project.title}</CardTitle>
              <CardDescription>{project.description}</CardDescription>
            </CardContent>
            <CardFooter>
              {project.technologies.map((technology) => (
                <span key={technology} className="mr-2 text-sm text-gray-600">
                  {technology}
                </span>
              ))}
            </CardFooter>
          </Card>
        ))}
      </div>
    </Container>
  );
}

const projects = [
  {
    id: 1,
    title: "mehmetyigityalim.com",
    description: "Personal website",
    image: "mehmetyigityalim.com.png",
    technologies: ["Next.js", "Tailwind CSS", "Vercel"],
    url: "https://mehmetyigityalim.com",
  },
  {
    id: 2,
    title: "Geist",
    description: "Modern and minimalist design system",
    image: "geist.png",
    technologies: ["React", "Next.js", "Tailwind CSS"],
    url: "https://geist-ui.dev",
  },
  {
    id: 3,
    title: "Fuarium ERP",
    description: "ERP software for fairs",
    image: "fuarium.png",
    technologies: ["React", "Node.js", "MongoDB"],
    url: "https://app.fuarium.com",
  },
  {
    id: 4,
    title: "API",
    description: "RESTful API for mehmetyigityalim.com",
    image: "api.png",
    technologies: ["Node.js", "Express", "MongoDB"],
    url: "https://api.mehmetyigityalim.com",
  },
  {
    id: 5,
    title: "Status",
    description: "Status page for mehmetyigityalim.com",
    image: "status.png",
    technologies: ["Next.js", "Tailwind CSS", "Vercel"],
    url: "https://status.mehmetyigityalim.com",
  },
];
