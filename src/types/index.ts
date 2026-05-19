export interface EvaluatorSheet {
  id: string;
  qp_code: string;
  packet_number: string;
  date: string | null;
  subject_name: string;
  evaluator_name: string;
  evaluator_code: string;
  board_evaluator: string;
  trimester: string;
  evaluator_signature: string;
  board_evaluator_signature: string;
  signature_date: string | null;
  remarks: string;
  created_at: string;
  updated_at: string;
}

export interface StudentMark {
  id?: string;
  sheet_id: string;
  sl_no: number;
  q1: number;
  q2: number;
  q3: number;
  q4: number;
  q5: number;
  q6: number;
  q7: number;
  q8: number;
  q9: number;
  total_marks: number;
}

export interface SheetWithMarks extends EvaluatorSheet {
  marks: StudentMark[];
}

export const EMPTY_SHEET: Omit<EvaluatorSheet, 'id' | 'created_at' | 'updated_at'> = {
  qp_code: '',
  packet_number: '',
  date: null,
  subject_name: '',
  evaluator_name: '',
  evaluator_code: '',
  board_evaluator: '',
  trimester: '',
  evaluator_signature: '',
  board_evaluator_signature: '',
  signature_date: null,
  remarks: '',
};

export const createEmptyMarks = (sheetId: string): StudentMark[] => {
  return Array.from({ length: 20 }, (_, i) => ({
    sheet_id: sheetId,
    sl_no: i + 1,
    q1: 0,
    q2: 0,
    q3: 0,
    q4: 0,
    q5: 0,
    q6: 0,
    q7: 0,
    q8: 0,
    q9: 0,
    total_marks: 0,
  }));
};

export const calculateTotal = (mark: Omit<StudentMark, 'id' | 'total_marks'>): number => {
  return mark.q1 + mark.q2 + mark.q3 + mark.q4 + mark.q5 + mark.q6 + mark.q7 + mark.q8 + mark.q9;
};
