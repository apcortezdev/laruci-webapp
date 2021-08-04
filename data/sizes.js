const dummySizes = [
  { _id: 'XP', name: 'XP', sizeCm: '5' },
  { _id: 'P', name: 'P', sizeCm: '5' },
  { _id: 'M', name: 'M', sizeCm: '5' },
  { _id: 'G', name: 'G', sizeCm: '5' },
  { _id: 'GG', name: 'GG', sizeCm: '5' },
  { _id: 'XG', name: 'XG', sizeCm: '5' },
];

export async function getSizes() {
  return dummySizes;
}
