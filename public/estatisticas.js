let chartInstance;

async function fetchStatistics() {
    const totalSpan = document.getElementById("total-incidentes");
    const abertoSpan = document.getElementById("abertos");
    const resolvidoSpan = document.getElementById("resolvidos");
    const porIniciarSpan = document.getElementById("por-iniciar");
    const canvas = document.getElementById("chartIncidentes");

    if (!totalSpan || !canvas) {
        return;
    }

    try {
        const res = await fetch("/api/estatisticas", { credentials: "include" });
        if (!res.ok) {
            throw new Error(`Falha ao carregar estatísticas (${res.status})`);
        }

        const data = await res.json();
        const incidentesPorEstado = data.incidentesPorEstado || data.porEstado || {};

        totalSpan.textContent = data.total ?? 0;
        abertoSpan.textContent = incidentesPorEstado["Aberto"] || 0;
        resolvidoSpan.textContent = incidentesPorEstado["Resolvido"] || 0;
        porIniciarSpan.textContent = incidentesPorEstado["Por iniciar"] || 0;

        const labels = ["Por iniciar", "Aberto", "Resolvido"];
        const valores = labels.map((estado) => incidentesPorEstado[estado] || 0);

        if (chartInstance) {
            chartInstance.destroy();
        }

        chartInstance = new Chart(canvas.getContext("2d"), {
            type: "bar",
            data: {
                labels,
                datasets: [
                    {
                        label: "Número de Incidentes",
                        data: valores,
                        borderWidth: 2,
                        backgroundColor: [
                            "rgba(255, 206, 86, 0.5)",
                            "rgba(255, 99, 132, 0.5)",
                            "rgba(75, 192, 192, 0.5)",
                        ],
                        borderColor: [
                            "rgba(255, 206, 86, 1)",
                            "rgba(255, 99, 132, 1)",
                            "rgba(75, 192, 192, 1)",
                        ],
                    },
                ],
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 },
                    },
                },
                plugins: {
                    legend: {
                        labels: {
                            color: "#03320C",
                            font: { size: 14, family: "Inter" },
                        },
                    },
                },
            },
        });
    } catch (err) {
        console.error("Erro ao carregar estatísticas:", err);
    }
}

document.addEventListener("DOMContentLoaded", fetchStatistics);
window.fetchStatistics = fetchStatistics;
