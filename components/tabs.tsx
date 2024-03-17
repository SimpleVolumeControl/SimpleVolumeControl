import React, { FC, useState } from 'react';

interface Tab {
  id: number;
  title: React.ReactNode;
  content: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
}

const Tabs: FC<TabsProps> = ({ tabs }) => {
  const [id, setId] = useState<number>(0);
  return (
    <>
      <div className="tabs md:tabs-lg tabs-lifted -mb-px z-10">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            className={`tab [&&]:border-b-0 ${id === tab.id ? 'tab-active' : ''}`}
            onClick={() => setId(tab.id)}
          >
            {tab.title}
          </a>
        ))}
      </div>
      <div
        className={`bg-base-100 border border-base-300 p-4 rounded-b-box ${
          id !== tabs[0]?.id ? 'rounded-tl-box ' : ''
        } ${id !== tabs.at(-1)?.id ? 'rounded-tr-box ' : ''}`}
      >
        {tabs.find((tab) => id === tab.id)?.content ?? ''}
      </div>
    </>
  );
};

export default Tabs;
