const mockData = () => {
    return [
        {
            title: 'BalanceSheet',
            subitems: [
                {
                    title: 'TotalAssets',
                    subitems: [
                        {
                            title: 'CurrentAssets',
                        },
                        {
                            title: 'LongTermAssets',
                        },
                    ],
                },
            ],
        }
    ];
};

export default mockData;
