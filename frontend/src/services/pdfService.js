import API from './api';

export const generateTripPDF = async (tripId) => {
  const response = await API.get(`/trips/${tripId}/pdf`, {
    responseType: 'blob'
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `trip-${tripId}.pdf`);
  document.body.appendChild(link);
  link.click();
  link.remove();
};
