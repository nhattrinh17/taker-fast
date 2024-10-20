// Hàm tính tuần thứ bao nhiêu trong năm (theo tuần từ Thứ 2 - Chủ nhật)
function getWeekNumber(date: Date): number {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfWeek = startOfYear.getDay();
  const daysPastSinceStartOfYear = (date.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000);

  // Nếu ngày đầu năm không phải là thứ 2, điều chỉnh để tuần bắt đầu từ thứ 2
  const adjustedDayOfWeek = (dayOfWeek + 6) % 7; // Điều chỉnh để Thứ 2 là ngày đầu tiên (0)
  return Math.ceil((daysPastSinceStartOfYear + adjustedDayOfWeek) / 7);
}

// Interface cho giá trị tuần
interface Week {
  weekNumber: number;
  start: string;
  end: string;
}

// Hàm lấy ngày bắt đầu (thứ 2) và kết thúc (chủ nhật) của tuần
function getWeekStartAndEnd(weekNumber: number, year: number): { start: Date; end: Date } {
  const startOfYear = new Date(year, 0, 1);
  const dayOfWeek = startOfYear.getDay();

  // Điều chỉnh để bắt đầu từ thứ 2
  const adjustedDayOfWeek = (dayOfWeek + 6) % 7; // Thứ 2 = 0, Thứ 3 = 1, ..., Chủ nhật = 6

  // Tính ngày bắt đầu tuần
  const start = new Date(startOfYear.setDate(1 + (weekNumber - 1) * 7 - adjustedDayOfWeek));

  // Ngày kết thúc là 6 ngày sau (Chủ nhật)
  const end = new Date(start);
  end.setDate(start.getDate() + 6);

  return { start, end };
}

// Hiển thị danh sách các tuần (bắt đầu từ thứ 2 đến CN)
export function generateWeeksList(): Week[] {
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  const year = today.getFullYear();
  const weeks: Week[] = [];

  // Lấy các tuần từ tuần hiện tại về trước
  for (let i = currentWeek; i > 0; i--) {
    const { start, end } = getWeekStartAndEnd(i, year);
    weeks.push({
      weekNumber: i,
      start: start.toLocaleDateString(),
      end: end.toLocaleDateString(),
    });
  }

  return weeks;
}

export function getDataCurrentWeek(): Week {
  const today = new Date();
  const currentWeek = getWeekNumber(today);
  const year = today.getFullYear();
  const { start, end } = getWeekStartAndEnd(currentWeek, year);
  return {
    weekNumber: currentWeek,
    start: start.toLocaleDateString(),
    end: end.toLocaleDateString(),
  };
}
