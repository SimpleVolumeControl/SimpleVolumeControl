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
      <div className="tabs -mb-px z-10">
        {tabs.map((tab) => (
          <a
            key={tab.id}
            className={`tab md:tab-lg tab-lifted border-b-0 ${
              id === tab.id ? 'tab-active' : ''
            }`}
            onClick={() => setId(tab.id)}
          >
            {tab.title}
          </a>
        ))}
        <span></span>
      </div>
      <div
        className={`bg-base-100 border border-base-300 p-4 ${
          id === tabs[0]?.id ? 'rounded-tr-box rounded-b-box' : 'rounded-box'
        }`}
      >
        {tabs.find((tab) => id === tab.id)?.content ?? ''}
      </div>
    </>
  );
};

export default Tabs;
