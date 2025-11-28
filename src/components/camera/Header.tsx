import { useEffect, useState } from "react";
import Battery from "../../assets/icons/Battery";
import SimCard from "../../assets/icons/SimCard";

const Header = () => {
  const [time, setTime] = useState<Date>(new Date(0, 0, 0));
  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <div className="header py-1 px-2 bg-[#141414] rounded-t-xl ">
      <div className="flex justify-between">
        <div className="flex gap-4">
          <div>FUJIFILM XT-30 II</div>
          <div>AUTO</div>
        </div>
        <div className="flex gap-4">
          <div className="w-5">
            <SimCard />
          </div>
          <div className="w-6">
            <Battery />
          </div>

          <div>{time.toLocaleDateString()}</div>
          <div className="hidden sm:block">
            {time.toLocaleTimeString().substring(0, 2)}
            <span>:</span>
            {time.toLocaleTimeString().substring(3, 5)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
