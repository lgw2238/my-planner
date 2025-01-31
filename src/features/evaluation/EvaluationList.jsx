import React, { useState } from 'react';
import EvaluationModal from './EvaluationModal';

// mock data
const generateMockData = () => {
  const quarters = ['Q1', 'Q2', 'Q3', 'Q4'];
  const reviewTypes = [
    'Performance Review',
    'Team Assessment',
    'Project Evaluation',
    'Skills Assessment',
    'Leadership Review',
    'Peer Review'
  ];

  return Array.from({ length: 98 }, (_, index) => {
    const year = 2024 - Math.floor(index / 24); // 4년치 데이터
    const quarter = quarters[Math.floor((index % 24) / 6)];
    const reviewType = reviewTypes[index % reviewTypes.length];
    
    return {
      id: index + 1,
      title: `${year} ${quarter} ${reviewType} #${index + 1}`,
      status: index % 5 === 0 ? 'Completed' : 
              index % 5 === 1 ? 'In Progress' : 
              index % 5 === 2 ? 'Pending' : 
              index % 5 === 3 ? 'Delayed' : 'Scheduled',
      dueDate: new Date(year, Math.floor(index % 12), 15 + (index % 15))
        .toISOString().split('T')[0]
    };
  });
};

const EvaluationList = () => {
  const [evaluations, setEvaluations] = useState(generateMockData());
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null);
  const itemsPerPage = 10;

  // calculate the index of the last item and the first item on the current page
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = evaluations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(evaluations.length / itemsPerPage);

  const handleAddEvaluation = (newEvaluation) => {
    setEvaluations(prev => [...prev, newEvaluation]);
  };

  const handleEditEvaluation = (updatedEvaluation) => {
    setEvaluations(prev =>
      prev.map(item =>
        item.id === updatedEvaluation.id ? updatedEvaluation : item
      )
    );
  };

  const handleDeleteEvaluation = (id) => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      setEvaluations(prev => prev.filter(item => item.id !== id));
      
      // in last data delete, total page number is decreased
      const newTotalPages = Math.ceil((evaluations.length - 1) / itemsPerPage);
      if (currentPage > newTotalPages) {
        setCurrentPage(newTotalPages);
      }
    }
  };

  const handleSave = (evaluationData) => {
    if (selectedEvaluation) {
      handleEditEvaluation(evaluationData);
    } else {
      handleAddEvaluation(evaluationData);
    }
  };

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-color-pastel-navy">
            Evaluation Management
          </h2>
          <button
            onClick={() => {
              setSelectedEvaluation(null);
              setIsModalOpen(true);
            }}
            className="bg-color-pastel-navy text-white px-4 py-2 rounded hover:bg-color-pastel-navy/80"
          >
            Add New Evaluation
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Due Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentItems.map((evaluation) => (
                <tr key={evaluation.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {evaluation.title}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                      ${evaluation.status === 'Completed' 
                        ? 'bg-green-100 text-green-800' 
                        : evaluation.status === 'In Progress' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : evaluation.status === 'Pending' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : evaluation.status === 'Delayed' 
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'}`}
                    >
                      {evaluation.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {evaluation.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedEvaluation(evaluation);
                        setIsModalOpen(true);
                      }}
                      className="text-color-pastel-navy hover:text-color-pastel-navy/80 mr-3"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEvaluation(evaluation.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex justify-center">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-color-pastel-navy text-white hover:bg-color-pastel-navy/80'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={`px-3 py-1 rounded ${
                    currentPage === number
                      ? 'bg-color-pastel-navy text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  {number}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-color-pastel-navy text-white hover:bg-color-pastel-navy/80'
              }`}
            >
              Next
            </button>
          </div>
        </div>

        <EvaluationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedEvaluation(null);
          }}
          evaluation={selectedEvaluation}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default EvaluationList; 