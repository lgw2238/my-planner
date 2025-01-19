import React from 'react';

const EvaluationList = () => {
  const evaluations = [
    { id: 1, title: '2024년 1분기 평가', status: '진행중', dueDate: '2024-03-31' },
    { id: 2, title: '2023년 4분기 평가', status: '완료', dueDate: '2023-12-31' },
    { id: 3, title: '2023년 3분기 평가', status: '완료', dueDate: '2023-09-30' },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-naver-pastel-navy mb-6">평가 관리</h2>
      <div className="bg-white rounded-lg shadow">
        <div className="grid grid-cols-4 gap-4 p-4 border-b bg-naver-pastel-gray/20 font-medium">
          <div>평가명</div>
          <div>상태</div>
          <div>마감일</div>
          <div>작업</div>
        </div>
        {evaluations.map((evaluation) => (
          <div key={evaluation.id} className="grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50">
            <div>{evaluation.title}</div>
            <div>
              <span className={`px-2 py-1 rounded-full text-sm ${
                eval.status === '진행중' 
                  ? 'bg-naver-pastel-blue/20 text-blue-700'
                  : 'bg-naver-pastel-green/20 text-green-700'
              }`}>
                {eval.status}
              </span>
            </div>
            <div>{eval.dueDate}</div>
            <div>
              <button className="text-naver-pastel-navy hover:underline">
                상세보기
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EvaluationList; 