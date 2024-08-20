<script setup lang="ts">
import { api } from '@/api';
import { useModal } from '@/composables/useModal';
import { useToast } from '@/composables/useToast';
import { ref, computed } from 'vue';
const modal = useModal<boolean>();
const toast = useToast();
const applicationFormRef = ref();
const startValidation = ref(false);

let errors = []

const formData = ref({
  applicantName: '',
  applicantEmail: '',
  applicantMobilePhoneNumber: '',
  applicantAddress: '',
  annualIncomeBeforeTax: 0,
  incomingAddress: '',
  incomingDeposit: 0,
  incomingPrice: 0,
  incomingStampDuty: 0,
  loanAmount: 0,
  loanDuration: 0,
  monthlyExpenses: 0,
  outgoingAddress: '',
  outgoingMortgage: 0,
  outgoingValuation: 0,
  savingsContribution: 0,
});


const isValidApplicantName = computed(() => {  
  if (startValidation.value) {
    return /^[A-Za-z\s]{3,20}$/.test(formData.value.applicantName);;  
  }
  return true;
})

const isValidEmail = computed(() => {
  if (startValidation.value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.value.applicantEmail);
  }
  return true;
});

const isValidPhoneNumber = computed(() => {
  if (startValidation.value) {    
    return /^\(\+\d{1,4}\)\s\d{10}$/.test(formData.value.applicantMobilePhoneNumber);
  }
  return true;
});

const isValidAddress = computed(() => {
  if (startValidation.value) {
    return /^[A-Za-z0-9\s\.\-,]+$/.test(formData.value.applicantAddress);
  }
  return true;
});

const isValidIncome = computed(() => {
  if (startValidation.value) {
    return formData.value.annualIncomeBeforeTax > 0;
  } 
  return true; 
});

const isValidIncomingAddress = computed(() => {
  if (startValidation.value) {
    return /^[A-Za-z0-9\s\.\-,]+$/.test(formData.value.incomingAddress); 
  }  
  return true;
})

const isValidIncomingDeposit = computed(() => {
  if (startValidation.value) {
    return formData.value.incomingDeposit > 0;
  }  
  return true;
});

const isValidIncomingPrice = computed(() => {
  if (startValidation.value) {
    return formData.value.incomingPrice > 0;  
  }
  return true;
});

const isValidIncomingStampDuty = computed(() => {
  if (startValidation.value) {
    return formData.value.incomingStampDuty > 0;  
  }
  return true;
});

const isValidLoanAmount = computed(() => {
  if (startValidation.value) {
    return formData.value.loanAmount > 0;
  }
  return true;
});

const isValidLoanDuration = computed(() => {
  if (startValidation.value) {
    return formData.value.loanDuration > 0;
  }
  return true;
});

const isValidMonthlyExpenses = computed(() => {
  if (startValidation.value) {
    return formData.value.monthlyExpenses > 0;
  }
  return true;
}); 

const isValidOutgoingAddress = computed(() => {
  if (startValidation.value) {
    return /^[A-Za-z0-9\s\.\-,]+$/.test(formData.value.outgoingAddress);
  }
  return true;
});

const isValidOutgoingMortgage = computed(() => {
  if (startValidation.value) {
    return formData.value.outgoingMortgage > 0;
  }
  return true;
}); 

const isValidOutgoingValuation = computed(() => {
  if (startValidation.value) {
    return formData.value.outgoingValuation > 0;
  }
  return true;
});

const isValidSavingsContribution = computed(() => {
  if (startValidation.value) {
    return formData.value.savingsContribution > 0;
  }
  return true;
});

const isValidForm = computed(() => {
  return isValidApplicantName.value && isValidEmail.value && isValidPhoneNumber.value && isValidAddress.value &&
    isValidIncome.value && isValidIncomingAddress.value && isValidIncomingDeposit.value && isValidIncomingPrice.value && isValidIncomingStampDuty.value && isValidLoanAmount.value && isValidLoanDuration.value && isValidMonthlyExpenses.value && isValidOutgoingAddress.value && isValidOutgoingMortgage.value && isValidOutgoingValuation.value && isValidSavingsContribution.value;
});

const submitApplication = async () => {
  startValidation.value = true;
  if (!isValidForm.value) {
    return;
  }
  try {

    const response = await api.applications.post(formData.value);
    if (response.success) toast.success(`Application Saved Successfully.<br> Returned Loan Amount : $${response.loanAmount}`);
    else {
      toast.error('Error occurred while saving application');
      formData.value.applicantName = '';
      formData.value.applicantEmail = '';
      formData.value.applicantMobilePhoneNumber = '';
      formData.value.applicantAddress = '';
      formData.value.annualIncomeBeforeTax = 0;
      formData.value.incomingAddress = '';
      formData.value.incomingDeposit = 0;
      formData.value.incomingPrice = 0;
      formData.value.incomingStampDuty = 0;
      formData.value.loanAmount = 0;
      formData.value.loanDuration = 0;
      formData.value.monthlyExpenses = 0;
      formData.value.outgoingAddress = '';
      formData.value.outgoingMortgage = 0;
      formData.value.outgoingValuation = 0;
      formData.value.savingsContribution = 0;
    }
    modal.confirm(true)

  } catch (error) {
    toast.error('An error occurred');
  }
}


</script>

<template>
  <div class="action-section">
    <BCard align-title="center" align-footer="center" align-content="center">
      <template #title>Submit loan application</template>
      <BSvgIcon name="dashboard-loan" />
      <template #footer>
        <BButton
          variant="primary"
          label="Submit application"
          icon-pos="right"
          icon="pi pi-chevron-right"
          @click="modal.showModal()"
        />
      </template>
    </BCard>

    <BModal :visible="modal.isVisible.value" :confirm="modal.confirm">
      <template #header>Submit loan application</template>
      <p v-if="errors.length">
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for="error in errors">{{ error }}</li>
        </ul>
      </p>
      <form id="application_form" ref="applicationFormRef">
        <!-- Need to change with v-for after change state with object -->
        <label for="applicant_name">Name</label>
        <BTextInput v-model="formData.applicantName" id="applicant_name" type="text" required />
        <div class="error">{{ isValidApplicantName? '' : 'Please enter a valid name' }}</div>

        <label for="applicant_email">Email</label>
        <BTextInput v-model="formData.applicantEmail" id="applicant_email" type="email" required />
        <div class="error">{{ isValidEmail? '' : 'Please enter a valid email address' }}</div>

        <label for="applicant_mobile_phone_number">Mobile Phone Number</label>
        <BTextInput
          v-model="formData.applicantMobilePhoneNumber"
          id="applicant_mobile_phone_number"
          type="tel"
          required
        />
        <div class="error">{{ isValidPhoneNumber? '' : 'Please enter a valid phone number' }}</div>

        <label for="applicant_address">Applicant Address</label>
        <BTextInput v-model="formData.applicantAddress" id="applicant_address" required />
        <div class="error">{{ isValidAddress? '' : 'Please enter a valid address' }}</div>

        <label for="annual_income_before_tax">Annual Income Before Tax</label>
        <BNumberInput v-model="formData.annualIncomeBeforeTax" id="annual_income_before_tax" required />
        <div class="error">{{ isValidIncome? '' : 'Please enter a valid income' }}</div>

        <label for="incoming_address">Incoming Address</label>
        <BTextInput v-model="formData.incomingAddress" id="incoming_address" required />
        <div class="error">{{ isValidIncomingAddress? '' : 'Please enter a valid address' }}</div>

        <label for="incoming_deposit">Incoming deposit</label>
        <BNumberInput v-model="formData.incomingDeposit" id="incoming_deposit" required />
        <div class="error">{{ isValidIncomingDeposit? '' : 'Please enter a valid deposit' }}</div>

        <label for="incoming_price">Incoming Price</label>
        <BNumberInput v-model="formData.incomingPrice" id="incoming_price" required />
        <div class="error">{{ isValidIncomingPrice? '' : 'Please enter a valid price' }}</div>

        <label for="incoming_stamp_duty">Incoming Stamp Duty</label>
        <BNumberInput v-model="formData.incomingStampDuty" id="incoming_stamp_duty" required />
        <div class="error">{{ isValidIncomingStampDuty? '' : 'Please enter a valid stamp duty' }}</div>

        <label for="loan_amount">Loan Amount</label>
        <BNumberInput v-model="formData.loanAmount" id="loan_amount" required />
        <div class="error">{{ isValidLoanAmount? '' : 'Please enter a valid loan amount' }}</div>

        <label for="loan_duration">Loan Duration</label>
        <BNumberInput v-model="formData.loanDuration" id="loan_duration" required />
        <div class="error">{{ isValidLoanDuration? '' : 'Please enter a valid loan duration' }}</div>

        <label for="monthly_expenses">Monthly Expenses</label>
        <BNumberInput v-model="formData.monthlyExpenses" id="monthly_expenses" required />
        <div class="error">{{ isValidMonthlyExpenses? '' : 'Please enter a valid monthly expenses' }}</div>

        <label for="outgoing_address">Outgoing Address</label>
        <BTextInput v-model="formData.outgoingAddress" id="outgoing_address" required />
        <div class="error">{{ isValidOutgoingAddress? '' : 'Please enter a valid address' }}</div>

        <label for="outgoing_mortgage">Outgoing Mortgage</label>
        <BNumberInput v-model="formData.outgoingMortgage" id="outgoing_mortgage" required />
        <div class="error">{{ isValidOutgoingMortgage? '' : 'Please enter a valid mortgage' }}</div>

        <label for="outgoing_valuation">Outgoing Valuation</label>
        <BNumberInput v-model="formData.outgoingValuation" id="outgoing_valuation" required />
        <div class="error">{{ isValidOutgoingValuation? '' : 'Please enter a valid valuation' }}</div>

        <label for="savings_contribution">Savings Contribution</label>
        <BNumberInput v-model="formData.savingsContribution" id="savings_contribution" required />
        <div class="error">{{ isValidSavingsContribution? '' : 'Please enter a valid contribution' }}</div>
      </form>

      <template #footer>
        <BButton type="button" variant="primary" label="Submit" @click="submitApplication"></BButton>
        <BButton label="Cancel" @click="modal.confirm(false)"></BButton>
      </template>
    </BModal>
  </div>
</template>

<style lang="scss" scoped>
.action-section {
  display: flex;
  flex-flow: row wrap;
  gap: 1rem;
  align-items: stretch;
  container-type: inline-size;

  > * {
    flex: 1 1 100%;
  }

  @container (min-width: 900px) {
    > * {
      flex: 1 1 calc((100% - 2rem) / 3);
    }
  }
}

.b-card {
  height: 100%;
}

.b-icon {
  width: 5rem;
  height: 5rem;
}
.error {
  color: red;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}
</style>
