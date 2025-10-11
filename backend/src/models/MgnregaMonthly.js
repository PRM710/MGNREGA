import mongoose from "mongoose";

const MgnregaMonthlySchema = new mongoose.Schema({
  district_id: { type: String, index: true },
  year_month: { type: String, index: true },
  fin_year: String,
  state_name: String,
  district_name: String,

  Approved_Labour_Budget: Number,
  Average_Wage_rate_per_day_per_person: Number,
  Average_days_of_employment_provided_per_Household: Number,
  Differently_abled_persons_worked: Number,
  Material_and_skilled_Wages: Number,
  Number_of_Completed_Works: Number,
  Number_of_GPs_with_NIL_exp: Number,
  Number_of_Ongoing_Works: Number,
  Persondays_of_Central_Liability_so_far: Number,
  SC_persondays: Number,
  ST_persondays: Number,
  Total_Exp: Number,
  Total_Households_Worked: Number,
  Wages: Number,
  Women_Persondays: Number,
  percent_of_Expenditure_on_Agriculture_Allied_Works: Number,

  fetched_at: { type: Date, default: Date.now }
});

MgnregaMonthlySchema.index({ district_id: 1, year_month: 1 }, { unique: true });

export default mongoose.model("MgnregaMonthly", MgnregaMonthlySchema);
