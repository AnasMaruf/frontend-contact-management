import { defineStore } from "pinia";
import { addressCreate, addressUpdate } from "../lib/api/AddressApi";
import { alertError, alertSuccess } from "../lib/alert";

export const useAddressStore = defineStore("address", {
  state: () => ({
    addresses: [],
    currentAddress: {
      street: "",
      city: "",
      province: "",
      country: "",
      postal_code: "",
    },
    loading: false,
    error: null,
  }),
  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
  },
  actions: {
    resetCurrentAddress() {
      this.currentAddress = {
        street: "",
        city: "",
        province: "",
        country: "",
        postal_code: "",
      };
    },

    setCurrentAddress(addressData) {
      this.currentAddress = { ...addressData };
    },

    updateAddressField(field, value) {
      this.currentAddress[field] = value;
    },

    clearError() {
      this.error = null;
    },

    async createAddress(token, id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await addressCreate(token, id, this.currentAddress);
        const responseBody = await response.json();
        if (response.status === 200) {
          this.addresses.push(responseBody.data);
          this.resetCurrentAddress();
          await alertSuccess("Address created successfully!");
          return { success: true, data: responseBody.data };
        } else {
          const errorMsg =
            responseBody.errors || responseBody.message || "Unknown error";
          this.error = errorMsg;
          await alertError(responseBody.errors);
          return { success: false, errors: responseBody.errors };
        }
      } catch (error) {
        await alertError("Failed to create address: " + error.message);
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    async addressUpdate(token, id, addressId) {
      this.loading = true;
      this.error = null;

      try {
        const response = await addressUpdate(
          token,
          id,
          addressId,
          this.currentAddress
        );
        const responseBody = await response.json();
        if (response.status === 200) {
          const index = this.addresses.findIndex(
            (addr) => addr.id === addressId
          );
          if (index !== -1) {
            this.addresses[index] = { ...responseBody.data };
          }
          await alertSuccess("Address updated successfully!");
          return { success: true, data: responseBody.data };
        } else {
          this.error = responseBody.errors;
          await alertError(responseBody.errors);
          return { success: false, errors: responseBody.errors };
        }
      } catch (error) {
        await alertError("Failed to update address: " + error.message);
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },
  },
});
