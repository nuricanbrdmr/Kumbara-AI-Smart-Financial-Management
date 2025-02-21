import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ScreenWrapper from '@/components/ScreenWrapper'
import Typo from '@/components/Typo'
import { colors, radius, spacingX, spacingY } from '@/constants/theme'
import { scale, verticalScale } from '@/utils/styling'
import Header from '@/components/Header'
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import { BarChart, LineChart, PieChart, PopulationPyramid, RadarChart } from "react-native-gifted-charts";
import Loading from '@/components/Loading'
import { fetchMonthlyStats, fetchWeeklyStats, fetchYearlyStats } from '@/services/transactionService'
import { useAuth } from '@/contexts/authContext'
import TransactionList from '@/components/TransactionList'

const Statistics = () => {
    const { user } = useAuth();
    const [activeIndex, setActiveIndex] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [chartLoading, setChartLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        if (activeIndex === 0) {
            getWeeklyStats();
        } else if (activeIndex === 1) {
            getMounthlyStats();
        } else {
            getYearlyStats();
        }
    }, [activeIndex])

    const getWeeklyStats = async () => {
        setChartLoading(true);
        let res = await fetchWeeklyStats(user?.uid as string)
        setChartLoading(false);
        if (res.success) {
            setChartData(res.data.stats);
            setTransactions(res.data.transactions);
        } else {
            Alert.alert("Error", res.msg);
        }
    }

    const getMounthlyStats = async () => {
        setChartLoading(true);
        let res = await fetchMonthlyStats(user?.uid as string)
        setChartLoading(false);
        if (res.success) {
            setChartData(res.data.stats);
            setTransactions(res.data.transactions);
        } else {
            Alert.alert("Error", res.msg);
        }
    }

    const getYearlyStats = async () => {
        setChartLoading(true);
        let res = await fetchYearlyStats(user?.uid as string)
        setChartLoading(false);
        if (res.success) {
            setChartData(res.data.stats);
            setTransactions(res.data.transactions);
        } else {
            Alert.alert("Error", res.msg);
        }
    }

    return (
        <ScreenWrapper>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Header title="İstatistikler" />
                </View>

                <ScrollView
                    contentContainerStyle={{
                        gap: spacingY._20,
                        paddingTop: spacingY._5,
                        paddingBottom: verticalScale(100),
                    }}
                    showsVerticalScrollIndicator={false}
                >
                    <SegmentedControl
                        values={['Haftalık', 'Aylık', 'Yıllık']}
                        selectedIndex={activeIndex}
                        onChange={(event) => {
                            setActiveIndex(event.nativeEvent.selectedSegmentIndex);
                        }}
                        tintColor={colors.neutral200}
                        backgroundColor={colors.neutral800}
                        appearance='dark'
                        activeFontStyle={styles.segmentFontStyle}
                        style={styles.segmentStyle}
                        fontStyle={{ ...styles.segmentFontStyle, color: colors.white }}
                    />

                    <View style={styles.chartContainer}>
                        {chartData.length > 0 ? (
                            <BarChart
                                data={chartData}
                                barWidth={scale(12)}
                                spacing={[1, 2].includes(activeIndex) ? scale(25) : scale(16)}
                                roundedTop
                                roundedBottom
                                hideRules
                                yAxisLabelPrefix='₺'
                                yAxisThickness={0}
                                xAxisThickness={0}
                                yAxisLabelWidth={[1, 2].includes(activeIndex) ? scale(38) : scale(35)}
                                yAxisTextStyle={{ color: colors.neutral350 }}
                                xAxisLabelTextStyle={{
                                    color: colors.neutral350,
                                    fontSize: verticalScale(12),
                                }}
                                noOfSections={3}
                                minHeight={5}
                            />
                        ) : (
                            <View style={styles.noChart}>
                                <Typo>
                                    Veri Yok
                                </Typo>
                            </View>
                        )}
                        {
                            chartLoading && (
                                <View style={styles.chartLoadingContainer}>
                                    <Loading color={colors.white} />
                                </View>
                            )
                        }
                    </View>
                    <View>
                        <TransactionList
                            title='İşlemler'
                            emptyListMessage='Hiçbir işlem bulunamadı'
                            data={transactions}
                        />
                    </View>
                </ScrollView>
            </View>
        </ScreenWrapper>
    )
}

export default Statistics

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: spacingX._20,
        paddingVertical: spacingX._5,
        gap: spacingY._10,
    },
    segmentStyle: {
        height: scale(37)
    },
    segmentFontStyle: {
        fontSize: verticalScale(13),
        fontWeight: 'bold',
        color: colors.black
    },
    searchIcon: {
        backgroundColor: colors.neutral700,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        height: verticalScale(35),
        width: verticalScale(35),
        borderCurve: "continuous"
    },
    chartContainer: {
        position: 'relative',
        justifyContent: "center",
        alignItems: "center",
    },
    chartLoadingContainer: {
        position: 'absolute',
        height: "100%",
        width: "100%",
        borderRadius: radius._12,
        backgroundColor: "rgba(0,0,0,0.6)",
    },
    noChart: {
        backgroundColor: "rgba(0,0,0,0.6)",
        height: verticalScale(210),
    },
    header: {

    }
})