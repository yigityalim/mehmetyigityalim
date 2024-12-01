import '@testing-library/jest-dom';
import { render, screen, fireEvent } from "@testing-library/react";
import { Incident, IncidentEvent } from "../incident";

describe("Incident", () => {
  const mockIncident = {
    id: "1",
    hash: null,
    title: "Test Incident",
    status: "investigating",
    type: "medium",
    created_at: new Date("2024-03-20T10:00:00"),
    updated_at: new Date("2024-03-20T10:00:00"),
    resolved_at: null,
    closed_at: null,
    site: {
      id: "1",
      name: "Test Site"
    },
    events: [
      {
        hash: "1",
        status: "created",
        message: "Olay oluşturuldu",
        created_at: new Date("2024-03-20T10:00:00")
      },
      {
        hash: "2",
        status: "investigating",
        message: "Araştırma başladı",
        created_at: new Date("2024-03-20T10:05:00")
      },
      {
        hash: "3",
        status: "resolved",
        message: "Sorun çözüldü",
        created_at: new Date("2024-03-20T10:10:00")
      },
      {
        hash: "4",
        status: "closed",
        message: "Olay kapatıldı",
        created_at: new Date("2024-03-20T10:15:00")
      }
    ]
  }

  it("başlığı ve site bilgisini gösterir", () => {
    render(<Incident incident={mockIncident} />);

    expect(screen.getByText("Test Incident")).toBeInTheDocument();
    expect(screen.getByText("Test Site")).toBeInTheDocument();
  });

  it("ilk 3 olayı gösterir ve diğerlerini gizler", () => {
    render(<Incident incident={mockIncident} />);

    expect(screen.getByText("Olay oluşturuldu")).toBeInTheDocument();
    expect(screen.getByText("Araştırma başladı")).toBeInTheDocument();
    expect(screen.getByText("Sorun çözüldü")).toBeInTheDocument();
    expect(screen.queryByText("Olay kapatıldı")).not.toBeInTheDocument();
  });

  it("'Daha fazla' butonu tıklandığında tüm olayları gösterir", () => {
    render(<Incident incident={mockIncident} />);

    fireEvent.click(screen.getByText("Daha fazla"));

    expect(screen.getByText("Olay kapatıldı")).toBeInTheDocument();
    expect(screen.getByText("Gizle")).toBeInTheDocument();
  });
});

describe("IncidentEvent", () => {
  const mockEvent = {
    hash: "1",
    status: "investigating" as const,
    message: "Test mesajı",
    created_at: new Date("2024-03-20T10:00:00")
  };

  it("olay detaylarını doğru şekilde gösterir", () => {
    render(<IncidentEvent event={mockEvent} />);

    expect(screen.getByText("Araştırılıyor -")).toBeInTheDocument();
    expect(screen.getByText("Test mesajı")).toBeInTheDocument();
    expect(screen.getByText("10:00")).toBeInTheDocument();
  });
});
