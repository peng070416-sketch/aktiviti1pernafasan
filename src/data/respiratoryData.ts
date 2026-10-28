export interface Organ {
  id: number;
  name: string;
  emoji: string;
  description: string;
  functionTitle: string;
  badgeColor: string;
}

export const ORGAN_DATA: Organ[] = [
  {
    id: 1,
    name: "Mulut / Hidung",
    emoji: "👃",
    functionTitle: "1. Mulut / Hidung",
    description: "Laluan udara masuk dan keluar daripada sistem pernafasan. Hidung menapis habuk & melembapkan udara yang disedut.",
    badgeColor: "from-blue-50 to-sky-50 border-sky-200 text-sky-900"
  },
  {
    id: 2,
    name: "Trakea",
    emoji: "🌬️",
    functionTitle: "2. Trakea",
    description: "Saluran pernafasan utama menyalurkan udara dari tekak ke bronkus dan membenarkan udara keluar semasa menghembus nafas.",
    badgeColor: "from-teal-50 to-emerald-50 border-teal-200 text-teal-900"
  },
  {
    id: 3,
    name: "Bronkus",
    emoji: "🌿",
    functionTitle: "3. Bronkus",
    description: "Dua cabang utama saluran udara membawa udara ke peparu kanan dan kiri.",
    badgeColor: "from-green-50 to-lime-50 border-green-200 text-green-900"
  },
  {
    id: 4,
    name: "Bronkiolus",
    emoji: "🔬",
    functionTitle: "4. Bronkiolus",
    description: "Cabang saluran udara yang lebih kecil daripada bronkus ke alveolus.",
    badgeColor: "from-purple-50 to-indigo-50 border-purple-200 text-purple-900"
  },
  {
    id: 5,
    name: "Paru-paru",
    emoji: "🫁",
    functionTitle: "5. Paru-paru",
    description: "Organ utama sistem pernafasan yang mengandungi salur udara & alveolus untuk pertukaran gas.",
    badgeColor: "from-rose-50 to-pink-50 border-rose-200 text-rose-900"
  },
  {
    id: 6,
    name: "Alveolus",
    emoji: "🫧",
    functionTitle: "6. Alveolus",
    description: "Kantung udara kecil tempat pertukaran gas oksigen & karbon dioksida berlaku.",
    badgeColor: "from-cyan-50 to-sky-50 border-cyan-200 text-cyan-900"
  },
  {
    id: 7,
    name: "Diafragma",
    emoji: "💨",
    functionTitle: "7. Diafragma",
    description: "Otot di bawah peparu yang mengecut (bergerak ke bawah) semasa menarik nafas & mengendur (bergerak ke atas) semasa menghembus nafas.",
    badgeColor: "from-amber-50 to-yellow-50 border-amber-200 text-amber-900"
  }
];

export interface QuizQuestion {
  id: number;
  question: string;
  options: { label: string; text: string }[];
  correct: string;
  explain: string;
}

export const QUIZ_DATA: QuizQuestion[] = [
  {
    id: 1,
    question: "1. Apakah fungsi utama trakea dalam sistem pernafasan manusia?",
    options: [
      { label: "A", text: "Mengepam darah ke seluruh badan." },
      { label: "B", text: "Menyalurkan udara antara bahagian tekak dengan bronkus." },
      { label: "C", text: "Menyerap nutrien daripada makanan." },
      { label: "D", text: "Menjadi tempat utama pertukaran oksigen dan karbon dioksida." }
    ],
    correct: "B",
    explain: "Trakea ialah saluran pernafasan utama yang menyalurkan udara antara bahagian tekak dengan bronkus."
  },
  {
    id: 2,
    question: "2. Di manakah pertukaran gas oksigen dan karbon dioksida berlaku?",
    options: [
      { label: "A", text: "Diafragma." },
      { label: "B", text: "Trakea." },
      { label: "C", text: "Alveolus." },
      { label: "D", text: "Bronkus." }
    ],
    correct: "C",
    explain: "Alveolus ialah kantung udara kecil di dalam peparu yang menjadi tempat pertukaran gas oksigen dan karbon dioksida."
  },
  {
    id: 3,
    question: "3. Apakah yang dilakukan oleh diafragma semasa kita menarik nafas?",
    options: [
      { label: "A", text: "Diafragma mengecut dan bergerak ke bawah." },
      { label: "B", text: "Diafragma mengendur dan melengkung ke atas." },
      { label: "C", text: "Diafragma menapis habuk daripada udara." },
      { label: "D", text: "Diafragma menyalurkan udara ke bronkus." }
    ],
    correct: "A",
    explain: "Semasa menarik nafas, diafragma mengecut dan bergerak ke bawah untuk membenarkan isi padu rongga dada bertambah."
  }
];

// Zone styling configuration for Diagram
export const ZONE_COORDINATES: Record<number, { top: string; left?: string; right?: string; name: string; label: string }> = {
  1: { top: "5.5%", right: "2%", name: "Mulut / Hidung", label: "Petak 1" },
  2: { top: "23%", left: "2%", name: "Trakea", label: "Petak 2" },
  3: { top: "41.5%", right: "2%", name: "Bronkus", label: "Petak 3" },
  4: { top: "45%", left: "2%", name: "Bronkiolus", label: "Petak 4" },
  5: { top: "59%", left: "2%", name: "Paru-paru", label: "Petak 5" },
  6: { top: "61.5%", right: "2%", name: "Alveolus", label: "Petak 6" },
  7: { top: "75.5%", left: "2%", name: "Diafragma", label: "Petak 7" }
};
