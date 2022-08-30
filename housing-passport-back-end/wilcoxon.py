from scipy import stats
import statistics

gov = [30.3, 32.77, 12.4, 72.61, 83.89, 131.38, 135.09, 176.37]
me = [283, 41, 223, 378, 140, 168, 83, 272]
# names = [toby,jerrywatson,richGood,karl,philB,ced,dad,paulStap ]
print(statistics.mean(gov))
print(statistics.mean(me))

# gov = [3,3,3,1,3,3,2,2]
# me = [3,2,2,1,2,4,2,2]

result = stats.wilcoxon(gov, me, zero_method="wilcox")
result2 = stats.wilcoxon(gov, me, zero_method="wilcox", alternative="less")

print(result.statistic)
print(result.pvalue)
print(result2.statistic)
print(result2.pvalue)

# result2, p = stats.ttest_rel(gov, me)

# print(p)