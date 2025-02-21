import {
  SavingsTargetResultType,
  SavingsTargetType,
  SmartMarketDataType,
  SmartMarketResultType,
  SmartSavingDataType,
  SmartSavingResultType,
} from "@/types";

const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

export const SmartSavingsModel = async (
  userData: SmartSavingDataType,
  language: "en" | "tr"
): Promise<SmartSavingResultType> => {
  const currency = language === "tr" ? "₺" : "$";

  // Kullanıcı verilerine daha fazla bağlam ekleyin
  const userContext = `
    - Yaş: ${userData.age}
    - Meslek: ${userData.job}
    - Yaşadığı Şehir: ${userData.city}
  `;

  const chatSession = model.startChat({
    generationConfig,
    history: [
      {
        role: "user",
        parts: [
          {
            text: `You are an AI financial advisor that helps users save money based on their income, expenses, and financial goals. Your task is to analyze user-provided financial data and generate personalized saving suggestions.
            Respond in **${language === "tr" ? "Turkish" : "English"}**
            ${
              language === "tr"
                ? "IMPORTANT: Bütün hesaplamalarda ve önerilerde para birimi olarak Türk Lirası (₺) kullanın. Asla dolar ($) sembolü kullanmayın. Örnek: 350₺, 1000₺ gibi."
                : "Use USD ($) for all calculations and recommendations."
            }
  ### **User Data**
  - **Income (monthly):** ${currency}${userData.income}
  - **Fixed Expenses:** ${currency}${userData.fixedExpenses}
  - **Daily Expenses:** ${currency}${userData.dailyExpenses}
  - **Luxury Expenses:** ${currency}${userData.luxuryExpenses}
  - **Current Savings:** ${currency}${userData.currentSavings}
  - **Savings Goal:** ${currency}${userData.savingsGoal}
  
  ### **Additional User Context**
  ${userContext}
  
  ### **Task**
  Based on the provided financial data and user context, the AI should:
  1. **Calculate an optimal savings percentage** that the user should aim for, considering their specific situation.
  2. **Identify multiple spending categories where the user can reduce expenses** to reach their savings goal faster. Consider the user's lifestyle and context.
  3. **Provide at least 5 practical and diverse saving tips** customized to the user's spending habits, age, occupation, and location.
  4. **Estimate the time required (in months) to reach the savings goal** based on the recommended savings rate and potential lifestyle changes.
  5. **Suggest potential income increase strategies** based on the user's occupation and skills.
  
  ### **Output Format**
  Return a JSON output like this:
  
  \`\`\`json
  {
    "recommended_savings_percentage": "20%",
    "expense_categories_to_reduce": [
      {
        "category": "${
          language === "tr" ? "Lüks Harcamalar" : "Luxury Expenses"
        }",
        "reduction_percentage": "30%",
        "estimated_savings": "${currency}200"
      },
      {
        "category": "${
          language === "tr" ? "Günlük Harcamalar" : "Daily Expenses"
        }",
        "reduction_percentage": "15%",
        "estimated_savings": "${currency}150"
      }
    ],
    "savings_tips": [
      "${language === "tr" ? "Tip 1" : "Tip 1"}",
      "${language === "tr" ? "Tip 2" : "Tip 2"}",
      "${language === "tr" ? "Tip 3" : "Tip 3"}",
      "${language === "tr" ? "Tip 4" : "Tip 4"}",
      "${language === "tr" ? "Tip 5" : "Tip 5"}"
    ],
    "estimated_months_to_goal": 10,
    "income_increase_strategies": [
      "${language === "tr" ? "Strateji 1" : "Strategy 1"}",
      "${language === "tr" ? "Strateji 2" : "Strategy 2"}"
    ]
  }
  \`\`\`
  
  ${
    language === "tr"
      ? "ÖNEMLİ: Tüm para değerlerini Türk Lirası (₺) cinsinden belirtin. Önerilerde ve tasarruf miktarlarında $ yerine ₺ kullanın."
      : ""
  }
  Ensure that all recommendations and strategies are diverse, specific to the user's context, and avoid repetition.
  `,
          },
        ],
      },
    ],
  });

  try {
    const result = await chatSession.sendMessage(
      language === "tr"
        ? "Verilen finansal verilere ve kullanıcı bağlamına göre detaylı ve kişiselleştirilmiş tasarruf önerileri oluşturun. Tüm parasal değerleri Türk Lirası (₺) cinsinden belirtin ve önerilerin çeşitli olmasına dikkat edin."
        : "Generate detailed and personalized savings recommendations based on the provided data and user context. Ensure the suggestions are diverse and tailored to the user's specific situation."
    );
    const jsonResponse = JSON.parse(result.response.text());

    const sanitizedResponse: SmartSavingResultType = {
      age: userData.age,
      job: userData.job,
      city: userData.city,
      income: userData.income,
      fixedExpenses: userData.fixedExpenses,
      dailyExpenses: userData.dailyExpenses,
      luxuryExpenses: userData.luxuryExpenses,
      currentSavings: userData.currentSavings,
      savingsGoal: userData.savingsGoal,
      recommended_savings_percentage: jsonResponse.recommended_savings_percentage || "0%",
      expense_categories_to_reduce: Array.isArray(jsonResponse.expense_categories_to_reduce)
        ? jsonResponse.expense_categories_to_reduce
        : [],
      estimated_months_to_goal: jsonResponse.estimated_months_to_goal
        ? Number(jsonResponse.estimated_months_to_goal)
        : 0,
      savings_tips: Array.isArray(jsonResponse.savings_tips)
        ? jsonResponse.savings_tips
        : [],
      income_increase_strategies: Array.isArray(jsonResponse.income_increase_strategies)
        ? jsonResponse.income_increase_strategies
        : [],
    };
    
    return sanitizedResponse;
  } catch (parseError: any) {
    console.error("JSON Parse Error:", parseError.message);
    throw new Error("Failed to parse AI response.");
  }
};

export const SavingsForecastModel = async (
  userData: SavingsTargetType,
  language: "en" | "tr"
): Promise<SavingsTargetResultType> => {
  const currency = language === "tr" ? "₺" : "$";
  const isEnglish = language === "en";
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
              You are a financial advisor AI. Analyze the following financial data and provide savings recommendations. Respond in ${
                isEnglish ? "English" : "Turkish"
              }.
              
              User Financial Data:
              - Current savings: ${currency}${userData.current_savings}
              - Monthly income: ${currency}${userData.monthly_income}
              - Monthly expenses: ${currency}${userData.monthly_expenses}
              - Savings goal: ${currency}${userData.savings_goal}
              - Target date: ${userData.target_date}
              
              Important Calculations:
              1. Calculate the number of months between now and the target date.
              2. Calculate the additional savings needed: (Savings goal - Current savings)
              3. Calculate required monthly savings: (Additional savings needed / Number of months)
              4. Calculate recommended savings percentage: (Required monthly savings / Monthly income) * 100
              
              Provide the following based on accurate calculations:
              1. Required monthly savings to reach the goal by the target date
              2. Recommended expense reduction (if monthly expenses + required savings > monthly income)
              3. Projected completion date (should match or be earlier than the target date)
              4. Recommended savings percentage of income
              5. Estimated months to reach the goal (should match or be less than months to target date)
              6. Two specific and personalized recommendations for saving money based on the user's financial situation
              7. Two practical and actionable savings tips
              8. One main expense category to reduce, with a specific reduction target
              
              Respond ONLY with a JSON object in this exact format:
              {
                "required_monthly_savings": number,
                "recommended_expense_reduction": number,
                "projected_completion_date": "YYYY-MM-DD",
                "recommended_savings_percentage": "X%",
                "estimated_months_to_goal": number,
                "additional_recommendations": ["Specific Recommendation 1", "Specific Recommendation 2"],
                "savings_tips": ["Actionable Tip 1", "Actionable Tip 2"],
                "expense_category_to_reduce": "Category: Specific reduction target"
              }
              
              IMPORTANT:
              - Use ONLY the provided user data for calculations.
              - Ensure all calculations are accurate, realistic, and align with the target date.
              - The projected completion date MUST be on or before the target date.
              - Recommendations and tips should be specific, personalized, and directly actionable.
              - If the savings goal is not achievable by the target date with current income, suggest both expense reductions and income increases.
              - Use ${
                isEnglish ? "USD ($)" : "Turkish Lira (₺)"
              } for all monetary values.
              - Do NOT include any explanations or text outside the JSON object.
              `,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(
      "Analyze the data and provide recommendations."
    );

    try {
      const jsonResponse = JSON.parse(result.response.text());

      const sanitizedResponse: SavingsTargetResultType = {
        current_savings: userData.current_savings,
        monthly_income: userData.monthly_income,
        monthly_expenses: userData.monthly_expenses,
        savings_goal: userData.savings_goal,
        target_date: userData.target_date,
        required_monthly_savings:
          Number(jsonResponse.required_monthly_savings) || 0,
        recommended_expense_reduction:
          Number(jsonResponse.recommended_expense_reduction) || 0,
        projected_completion_date:
          jsonResponse.projected_completion_date || userData.target_date,
        additional_recommendations: Array.isArray(
          jsonResponse.additional_recommendations
        )
          ? jsonResponse.additional_recommendations.slice(0, 2)
          : [],
        recommended_savings_percentage: String(
          jsonResponse.recommended_savings_percentage || "0%"
        ),
        expense_category_to_reduce: String(
          jsonResponse.expense_category_to_reduce || ""
        ),
        estimated_months_to_goal:
          Number(jsonResponse.estimated_months_to_goal) || 0,
        savings_tips: Array.isArray(jsonResponse.savings_tips)
          ? jsonResponse.savings_tips.slice(0, 2)
          : [],
      };

      return sanitizedResponse;
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError.message);
      throw new Error("Failed to parse AI response.");
    }
  } catch (error: any) {
    console.error("Error generating savings recommendations:", error.message);
    throw error;
  }
};

// API'den Döviz ve Metal Fiyatlarını Çekmek İçin Fonksiyon
const fetchCurrencyGoldAndSilverPrices = async () => {
  const url =
    "https://live-metal-prices.p.rapidapi.com/v1/latest/XAU,XAG/TRY/gram";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f4d5799d0bmshdbe53ab59a8ba64p1eb72ajsn4867d8474185",
      "x-rapidapi-host": "live-metal-prices.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json(); // JSON formatında döndüreceğiz
    return result;
  } catch (error) {
    console.error("Error fetching currency and metal prices:", error);
    throw error;
  }
};

const fetchCurrencyUsdAndEuroPrices = async () => {
  const url =
    "https://doviz-ve-altin-fiyatlari-try.p.rapidapi.com/economy/currency/exchange-rate?code=USD%2CEUR";
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "f4d5799d0bmshdbe53ab59a8ba64p1eb72ajsn4867d8474185",
      "x-rapidapi-host": "doviz-ve-altin-fiyatlari-try.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json(); // JSON formatında döndüreceğiz
    return result;
  } catch (error) {
    console.error("Error fetching currency and metal prices:", error);
    throw error;
  }
};

// Model için Yatırım Tavsiyesi Fonksiyonu
export const SmartMarketForecastModel = async (
  userData: SmartMarketDataType,
  language: "en" | "tr"
): Promise<SmartMarketResultType> => {
  const currency = language === "tr" ? "₺" : "$";
  const isEnglish = language === "en";

  try {
    const goldAndSilverData = await fetchCurrencyGoldAndSilverPrices();
    const usdAndEuroData = await fetchCurrencyUsdAndEuroPrices();

    const extendedMarketData = {
      gold_price: goldAndSilverData.rates.XAU,
      silver_price: goldAndSilverData.rates.XAG,
      euro_price: usdAndEuroData.data[1].selling,
      usd_price: usdAndEuroData.data[0].selling,
    };

    const chatSession = model.startChat({
      generationConfig,
      history: [
        {
          role: "user",
          parts: [
            {
              text: `
You are an advanced AI financial advisor. Analyze the user's financial data and current market conditions, and provide tailored advice for achieving their savings and investment goals. Respond in ${
                isEnglish ? "English" : "Turkish"
              }.

User's Financial Data:
- Current savings: ${currency}${userData.current_savings}
- Monthly income: ${currency}${userData.monthly_income}
- Monthly expenses: ${currency}${userData.monthly_expenses}
- Target savings: ${currency}${userData.savings_goal}
- Target date: ${userData.target_date}

Market Data:
- Gold price (XAU/TRY/gram): ${extendedMarketData.gold_price}
- Silver price (XAG/TRY/gram): ${extendedMarketData.silver_price}
- Euro price (EUR/TRY): ${extendedMarketData.euro_price}
- USD price (USD/TRY): ${extendedMarketData.usd_price}

Important Calculations:
1. Calculate the number of months between now and the target date.
2. Calculate the additional savings needed: (Target savings - Current savings)
3. Calculate required monthly savings: (Additional savings needed / Number of months)
4. Calculate recommended savings percentage: (Required monthly savings / Monthly income) * 100

Provide the following based on accurate calculations and current market data:
1. Investment recommendation considering the user's financial situation and market conditions
2. Specific advice on gold, silver, and currency investments
3. An expense reduction plan if needed
4. Advice on savings vs. investment based on current interest rates
5. Suggested actions based on stock market trends
6. Three additional, personalized recommendations

Respond ONLY with a JSON object in this exact format:
{
  "current_savings": number,
  "monthly_income": number,
  "monthly_expenses": number,
  "savings_goal": number,
  "target_date": "YYYY-MM-DD",
  "required_monthly_savings": number,
  "recommended_savings_percentage": "X%",
  "investment_recommendation": "Detailed investment strategy",
  "gold_investment_advice": "Specific advice on gold investment",
  "silver_investment_advice": "Specific advice on silver investment",
  "currency_investment_advice": "Advice on USD or Euro investment",
  "expense_reduction_plan": "Detailed expense reduction plan if needed",
  "interest_rate_advice": "Advice on saving vs investing based on current rates",
  "stock_market_advice": "Suggested actions based on stock market trends",
  "additional_recommendations": [
    "Specific recommendation 1",
    "Specific recommendation 2",
    "Specific recommendation 3"
  ]
}

IMPORTANT:
- Use ONLY the provided user data and market data for calculations and recommendations.
- Ensure all calculations are accurate and realistic.
- All monetary values should be in ${
                isEnglish ? "USD ($)" : "Turkish Lira (₺)"
              }.
- Recommendations should be specific, personalized, and directly actionable.
- Consider the user's financial situation and market conditions for all advice.
- Do NOT include any explanations or text outside the JSON object.
`,
            },
          ],
        },
      ],
    });

    const result = await chatSession.sendMessage(
      isEnglish
        ? "Generate smart financial advice based on the user's data and current market conditions, including specific advice on gold, silver, and currency investment."
        : "Kullanıcının verilerine ve mevcut piyasa koşullarına dayanarak, altın, gümüş ve döviz yatırımları hakkında özel tavsiyeler de dahil olmak üzere akıllı finansal tavsiyeler oluşturun."
    );

    try {
      const jsonResponse = JSON.parse(result.response.text());

      // Validate and sanitize the response
      const sanitizedResponse: SmartMarketResultType = {
        current_savings:
          Number(jsonResponse.current_savings) || userData.current_savings,
        monthly_income:
          Number(jsonResponse.monthly_income) || userData.monthly_income,
        monthly_expenses:
          Number(jsonResponse.monthly_expenses) || userData.monthly_expenses,
        savings_goal:
          Number(jsonResponse.savings_goal) || userData.savings_goal,
        target_date: jsonResponse.target_date || userData.target_date,
        required_monthly_savings:
          Number(jsonResponse.required_monthly_savings) || 0,
        recommended_savings_percentage: String(
          jsonResponse.recommended_savings_percentage || "0%"
        ),
        investment_recommendation: String(
          jsonResponse.investment_recommendation || ""
        ),
        gold_investment_advice: String(
          jsonResponse.gold_investment_advice || ""
        ),
        silver_investment_advice: String(
          jsonResponse.silver_investment_advice || ""
        ),
        currency_investment_advice: String(
          jsonResponse.currency_investment_advice || ""
        ),
        expense_reduction_plan: String(
          jsonResponse.expense_reduction_plan || ""
        ),
        interest_rate_advice: String(jsonResponse.interest_rate_advice || ""),
        stock_market_advice: String(jsonResponse.stock_market_advice || ""),
        additional_recommendations: Array.isArray(
          jsonResponse.additional_recommendations
        )
          ? jsonResponse.additional_recommendations.slice(0, 3).map(String)
          : [],
      };

      return sanitizedResponse;
    } catch (parseError: any) {
      console.error("JSON Parse Error:", parseError.message);
      throw new Error("Failed to parse JSON response.");
    }
  } catch (error: any) {
    console.error("Error generating smart financial advice:", error.message);
    throw error;
  }
};
