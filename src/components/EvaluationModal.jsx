import React, { useState, useEffect } from 'react';

const EvaluationModal = ({ isOpen, onClose, evaluation, onSave }) => {
  const initialFormData = {
    title: '',
    status: 'Pending',
    dueDate: new Date().toISOString().split('T')[0]
  };

  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    if (evaluation) {
      setFormData({
        title: evaluation.title,
        status: evaluation.status,
        dueDate: evaluation.dueDate
      });
    } else {
      setFormData(initialFormData); // new evaluation data add
    }
  }, [evaluation, isOpen]); // isOpen is dependency array

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: evaluation?.id || Date.now()
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-naver-pastel-navy">
            {evaluation ? 'Edit Evaluation' : 'Add New Evaluation'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-naver-pastel-navy"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-naver-pastel-navy"
            >
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Delayed">Delayed</option>
              <option value="Scheduled">Scheduled</option>
            </select>
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Due Date</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-naver-pastel-navy"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-naver-pastel-navy text-white py-2 rounded hover:bg-naver-pastel-navy/80"
          >
            {evaluation ? 'Update' : 'Add'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EvaluationModal; 