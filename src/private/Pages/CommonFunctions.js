import BarIcon1 from "../../assets/images/Bar_Icon_01.svg";
import BarIcon2 from "../../assets/images/Bar_Icon_02.svg";
import BarIcon3 from "../../assets/images/Bar_Icon_03.svg";
import BarIcon4 from "../../assets/images/Bar_Icon_04.svg";
import BarIcon5 from "../../assets/images/Bar_Icon_05.svg";

import img1 from "../../assets/images/redBar.png";
import img2 from "../../assets/images/greenBar.png";
import img3 from "../../assets/images/violetBar.png";
import img4 from "../../assets/images/yellowBar.png";
import img5 from "../../assets/images/grassBar.png";

export const DynamicIcons = (index, option) => {
  const position = index + 1;
  if (option) {
    return position === 1
      ? img1
      : position === 2
      ? img2
      : position === 3
      ? img3
      : position === 4
      ? img4
      : img5;
  } else {
    return position === 1
      ? BarIcon1
      : position === 2
      ? BarIcon2
      : position === 3
      ? BarIcon3
      : position === 4
      ? BarIcon4
      : BarIcon5;
  }
};

export const sortArr = arr => {
  let sortedColumn = [];
  for (const data of Object.keys(arr)) {
    sortedColumn.push(arr[data]);
  }
  sortedColumn.sort((a, b) => (a.index > b.index ? 1 : -1));
  return sortedColumn || [];
};

export const arrayPositionSort = (arr, index, newItem) => [
  // part of the array before the specified index
  ...arr.slice(0, index),
  // inserted item
  newItem,
  // part of the array after the specified index
  ...arr.slice(index),
];


export const subjectiveScore = (
  connection
) => {
  let scores = connection?.subjectiveScores || [];

  let avg;
  if (scores?.length) {
    let { score: ttl } = scores.reduce(
      (a, b) =>
        ({
          score: a.score + b.score,
        })
    );
    avg = Number((ttl / scores.length).toFixed(1));
  }
  return avg;
};