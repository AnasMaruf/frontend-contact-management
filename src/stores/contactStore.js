// stores/contactStore.js
import { defineStore } from "pinia";
import {
  ContactCreate,
  ContactDetail,
  ContactUpdate,
  ContactList,
  ContactDelete,
} from "../lib/api/ContactApi";
import { alertError, alertSuccess } from "../lib/alert";

export const useContactStore = defineStore("contact", {
  state: () => ({
    contacts: [],
    currentContact: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
    },
    loading: false,
    error: null,
    // Search & Pagination states
    searchFilters: {
      name: "",
      email: "",
      phone: "",
      page: 1,
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      hasNextPage: false,
      hasPrevPage: false,
    },
  }),

  getters: {
    isLoading: (state) => state.loading,
    hasError: (state) => state.error !== null,
    getContactById: (state) => (id) => {
      return state.contacts.find((contact) => contact.id === id);
    },
    // Search & Pagination getters
    hasSearchFilters: (state) => {
      return (
        state.searchFilters.name ||
        state.searchFilters.email ||
        state.searchFilters.phone
      );
    },
    totalContacts: (state) => state.pagination.totalItems,
    canLoadMore: (state) => state.pagination.hasNextPage,
  },

  actions: {
    // Reset form contact
    resetCurrentContact() {
      this.currentContact = {
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
      };
    },

    // Set contact data
    setCurrentContact(contactData) {
      this.currentContact = { ...contactData };
    },

    // Update field tertentu
    updateContactField(field, value) {
      this.currentContact[field] = value;
    },

    // Create new contact
    async createContact(token) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ContactCreate(token, this.currentContact);
        const responseBody = await response.json();

        if (response.status === 200) {
          // Tambahkan ke daftar contacts jika berhasil
          this.contacts.push(responseBody.data);

          // Reset form
          this.resetCurrentContact();

          await alertSuccess("Contact created successfully");
          return { success: true, data: responseBody.data };
        } else {
          this.error = responseBody.errors;
          await alertError(responseBody.errors);
          return { success: false, errors: responseBody.errors };
        }
      } catch (error) {
        await alertError("Failed to create contact: " + error.message);
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Load all contacts with search and pagination
    async loadContacts(token, filters = {}) {
      this.loading = true;
      this.error = null;

      try {
        // Merge filters dengan searchFilters yang ada
        const searchParams = {
          name: filters.name || this.searchFilters.name,
          email: filters.email || this.searchFilters.email,
          phone: filters.phone || this.searchFilters.phone,
          page: filters.page || this.searchFilters.page,
        };

        const response = await ContactList(token, searchParams);
        const responseBody = await response.json();

        if (response.status === 200) {
          // Assuming API returns pagination info
          this.contacts = responseBody.data || [];

          // Update pagination info if available
          if (responseBody.pagination) {
            this.pagination = {
              currentPage: responseBody.pagination.current_page || 1,
              totalPages: responseBody.pagination.last_page || 1,
              totalItems: responseBody.pagination.total || 0,
              hasNextPage:
                responseBody.pagination.current_page <
                responseBody.pagination.last_page,
              hasPrevPage: responseBody.pagination.current_page > 1,
            };
          }

          // Update search filters
          this.searchFilters = { ...searchParams };

          return { success: true, data: responseBody.data };
        } else {
          this.error = responseBody.errors;
          await alertError(responseBody.errors);
          return { success: false, errors: responseBody.errors };
        }
      } catch (error) {
        this.error = error.message;
        await alertError("Failed to load contacts");
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Search contacts
    async searchContacts(token, searchParams) {
      // Reset to first page when searching
      const params = { ...searchParams, page: 1 };
      return await this.loadContacts(token, params);
    },

    // Load next page
    async loadNextPage(token) {
      if (this.pagination.hasNextPage) {
        const nextPage = this.pagination.currentPage + 1;
        return await this.loadContacts(token, {
          ...this.searchFilters,
          page: nextPage,
        });
      }
    },

    // Load previous page
    async loadPrevPage(token) {
      if (this.pagination.hasPrevPage) {
        const prevPage = this.pagination.currentPage - 1;
        return await this.loadContacts(token, {
          ...this.searchFilters,
          page: prevPage,
        });
      }
    },

    // Clear search filters
    clearSearchFilters() {
      this.searchFilters = {
        name: "",
        email: "",
        phone: "",
        page: 1,
      };
    },

    // Delete contact
    async deleteContact(token, id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ContactDelete(token, id);

        if (response.status === 200) {
          // Remove contact from list
          this.contacts = this.contacts.filter((contact) => contact.id !== id);

          // Clear current contact if it's the deleted one
          if (this.currentContact.id === id) {
            this.resetCurrentContact();
          }

          return { success: true };
        } else {
          const responseBody = await response.json();
          this.error = responseBody.errors;
          await alertError(responseBody.errors);
          return { success: false, errors: responseBody.errors };
        }
      } catch (error) {
        this.error = error.message;
        await alertError("Failed to delete contact");
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Set loading state
    setLoading(status) {
      this.loading = status;
    },

    // Clear error
    clearError() {
      this.error = null;
    },

    // Get contact detail
    async getContactDetail(token, id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ContactDetail(token, id);
        const responseBody = await response.json();

        if (response.status === 200) {
          this.setCurrentContact(responseBody.data);
          return { success: true, data: responseBody.data };
        } else {
          this.error = responseBody.errors;
          await alertError(responseBody.errors);
          return { success: false, errors: responseBody.errors };
        }
      } catch (error) {
        this.error = error.message;
        await alertError("Failed to fetch contact details");
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },

    // Update existing contact
    async updateContact(token, id) {
      this.loading = true;
      this.error = null;

      try {
        const response = await ContactUpdate(token, id, this.currentContact);
        const responseBody = await response.json();

        if (response.status === 200) {
          // Update contact dalam daftar jika ada
          const index = this.contacts.findIndex((contact) => contact.id === id);
          if (index !== -1) {
            this.contacts[index] = { ...responseBody.data };
          }

          await alertSuccess("Contact updated successfully!");
          return { success: true, data: responseBody.data };
        } else {
          this.error = responseBody.errors;
          await alertError(responseBody.errors);
          return { success: false, errors: responseBody.errors };
        }
      } catch (error) {
        this.error = error.message;
        await alertError("Failed to update contact");
        return { success: false, error: error.message };
      } finally {
        this.loading = false;
      }
    },
  },
});
