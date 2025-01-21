import React, { useState, useEffect } from 'react';
import useStore from '../../store/useStore';

const EvaluationItemModal = ({ isOpen, onClose, item }) => {
  const { addEvaluationItem, updateEvaluationItem } = useStore();
  const [formData, setFormData] = useState({
    name: '',
    type: 'text',
    options: [],
    required: false
  });

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name,
        type: item.type,
        options: item.options || [],
        required: item.required
      });
    } else {
      setFormData({
        name: '',
        type: 'text',
        options: [],
        required: false
      });
    }
  }, [item]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (item) {
      updateEvaluationItem({ ...formData, id: item.id });
    } else {
      addEvaluationItem({ ...formData, id: Date.now() });
    }
    onClose();
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const removeOption = (index) => {
    const newOptions = formData.options.filter((_, i) => i !== index);
    setFormData({ ...formData, options: newOptions });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-[500px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-color-pastel-navy">
            {item ? 'Edit Evaluation Item' : 'Add Evaluation Item'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 mb-2">Item Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2">Type</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy"
            >
              <option value="text">Text</option>
              <option value="number">Number</option>
              <option value="select">Select</option>
              <option value="radio">Radio</option>
              <option value="checkbox">Checkbox</option>
            </select>
          </div>

          {(formData.type === 'select' || formData.type === 'radio' || formData.type === 'checkbox') && (
            <div>
              <label className="block text-gray-700 mb-2">Options</label>
              {formData.options.map((option, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-color-pastel-navy"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addOption}
                className="text-color-pastel-navy hover:text-color-pastel-navy/80"
              >
                + Add Option
              </button>
            </div>
          )}

          <div className="flex items-center">
            <input
              type="checkbox"
              id="required"
              checked={formData.required}
              onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
              className="w-4 h-4 text-color-pastel-navy rounded border-gray-300 focus:ring-color-pastel-navy"
            />
            <label htmlFor="required" className="ml-2 block text-gray-700">
              Required
            </label>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-color-pastel-navy text-white py-2 rounded hover:bg-color-pastel-navy/80"
            >
              {item ? 'Update' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvaluationItemModal; 