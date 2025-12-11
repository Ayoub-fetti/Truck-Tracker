import jsPDF from 'jspdf';

export const generateTripPDF = (trip) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('Ordre de Mission', 20, 30);
  
  doc.setFontSize(12);
  doc.text(`Trajet: ${trip.origin} → ${trip.destination}`, 20, 50);
  doc.text(`Date: ${new Date(trip.date).toLocaleDateString()}`, 20, 60);
  doc.text(`Statut: ${trip.status}`, 20, 70);
  doc.text(`Kilométrage: ${trip.kilometers || 'N/A'} km`, 20, 80);
  doc.text(`État véhicule: ${trip.vehicleState || 'N/A'}`, 20, 90);
  doc.text(`Consommation: ${trip.fuelConsumption || 'N/A'} L`, 20, 100);
  
  doc.save(`ordre-mission-${trip.id}.pdf`);
};
