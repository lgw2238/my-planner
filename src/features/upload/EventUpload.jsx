import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import useStore from '../../store/useStore';

const EventUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const addEvent = useStore((state) => state.addEvent);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setFile(file);
    setError('');
  };

  const handleCancelFile = () => {
    setFile(null);
    setError('');
    // input init
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) {
      fileInput.value = '';
    }
  };

  const validateEventData = (event) => {
    const required = ['title', 'date', 'startTime', 'endTime'];
    return required.every(field => event[field]);
  };

  const processExcel = async () => {
    if (!file) {
      setError('Please select a file.');
      return;
    }

    setLoading(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      const validEvents = [];
      const errors = [];

      jsonData.forEach((row, index) => {
        if (!validateEventData(row)) {
          errors.push(`Row ${index + 2}: required fields are missing.`);
          return;
        }

        validEvents.push({
          id: Date.now() + index,
          title: row.title,
          date: row.date.toString(),
          startTime: row.startTime,
          endTime: row.endTime,
          content: row.content || ''
        });
      });

      if (errors.length > 0) {
        setError(errors.join('\n'));
        return;
      }

      // send data to server (API implementation required)
      // const response = await fetch('/api/events/upload', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(validEvents)
      // });

      // update local state
      validEvents.forEach(event => {
        addEvent(event);
      });

      alert('Schedule uploaded successfully');
      setFile(null);
    } catch (err) {
      setError('An error occurred while processing the file.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const template = [
      {
        title: 'schedule title',
        date: 'YYYYMMDD',
        startTime: 'HH:MM',
        endTime: 'HH:MM',
        content: 'schedule content'
      }
    ];

    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'schedule template');
    XLSX.writeFile(wb, 'schedule_upload_template.xlsx');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-color-pastel-navy mb-6">Upload Schedule</h2>
      
      <div className="space-y-4">
        <div>
          <button
            onClick={downloadTemplate}
            className="bg-color-pastel-navy text-white px-4 py-2 rounded hover:bg-color-pastel-navy/80"
          >
            template download
          </button>
        </div>

        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileUpload}
              className="flex-1"
            />
            {file && (
              <button
                onClick={handleCancelFile}
                className="ml-2 text-red-500 hover:text-red-700"
              >
                ✕
              </button>
            )}
          </div>
          
          {file && (
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>select files: {file.name}</span>
                <button
                  onClick={handleCancelFile}
                  className="text-red-500 hover:text-red-700 px-2 py-1 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          
          <button
            onClick={processExcel}
            disabled={!file || loading}
            className={`w-full bg-color-pastel-navy text-white py-2 rounded
              ${(!file || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-color-pastel-navy/80'}`}
          >
            {loading ? 'processing...' : 'upload'}
          </button>
        </div>

        {error && (
          <div className="text-red-500 text-sm whitespace-pre-line">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventUpload; 