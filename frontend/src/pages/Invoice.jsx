import React from "react";
import { useLocation, Link } from "react-router-dom";
import {
  PDFDownloadLink,
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { CheckCircle, Download, Home, ArrowLeft } from "lucide-react";

const pdfStyles = StyleSheet.create({
  page: { padding: 40, fontFamily: "Helvetica" },
  header: { fontSize: 24, fontWeight: "bold", color: "#0284c7", marginBottom: 5 },
  subHeader: { fontSize: 12, color: "#64748b", marginBottom: 20 },
  section: { marginBottom: 15, padding: 10, backgroundColor: "#f8fafc", borderRadius: 4 },
  sectionTitle: { fontSize: 14, fontWeight: "bold", color: "#0f172a", marginBottom: 8 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4, fontSize: 10 },
  totalRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10, paddingTop: 6, borderTopWidth: 1, borderTopColor: "#cbd5e1", fontSize: 14, fontWeight: "bold" },
});

const InvoicePDF = ({ booking }) => (
  <Document>
    <Page size="A4" style={pdfStyles.page}>
      <Text style={pdfStyles.header}>TripSathi Travel Invoice</Text>
      <Text style={pdfStyles.subHeader}>Invoice #{booking._id ? booking._id.substring(0, 10) : "INV-2026-001"} | Official Payment Receipt</Text>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Customer Information</Text>
        <View style={pdfStyles.row}>
          <Text>Customer Name:</Text>
          <Text>{booking.name}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text>Email Address:</Text>
          <Text>{booking.email}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text>Phone Number:</Text>
          <Text>{booking.phone}</Text>
        </View>
      </View>

      <View style={pdfStyles.section}>
        <Text style={pdfStyles.sectionTitle}>Package & Travel Details</Text>
        <View style={pdfStyles.row}>
          <Text>Tour Package:</Text>
          <Text>{booking.tourTitle}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text>Fulfilling Agency:</Text>
          <Text>{booking.agencyName || "TripSathi Official"}</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text>Number of Travelers:</Text>
          <Text>{booking.travelers} Persons</Text>
        </View>
        <View style={pdfStyles.row}>
          <Text>Booking Status:</Text>
          <Text>{(booking.status || "CONFIRMED").toUpperCase()}</Text>
        </View>

        {booking.discountAmount > 0 && (
          <View style={pdfStyles.row}>
            <Text>Coupon Savings ({booking.couponCode}):</Text>
            <Text>-INR {booking.discountAmount}</Text>
          </View>
        )}

        <View style={pdfStyles.totalRow}>
          <Text>Total Paid Amount:</Text>
          <Text>INR {booking.totalPrice}</Text>
        </View>
      </View>
    </Page>
  </Document>
);

const Invoice = () => {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Booking Record Found</h2>
          <p className="text-gray-500 text-sm mb-6">
            Please book a package from the Tours page to generate your invoice.
          </p>
          <Link
            to="/tours"
            className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-sm shadow hover:bg-blue-700 transition"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Browse Tour Packages
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-sky-500 to-blue-600 p-8 text-white flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <CheckCircle className="w-6 h-6 text-emerald-300" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Payment Confirmed & Verified
              </span>
            </div>
            <h1 className="text-3xl font-extrabold">TripSathi Booking Invoice</h1>
            <p className="text-xs text-blue-100 mt-1">Invoice ID: #{booking._id || "TS-2026-INV"}</p>
          </div>

          <div className="text-right hidden sm:block">
            <span className="text-2xl font-black">₹{booking.totalPrice}</span>
            <span className="text-[10px] block text-blue-100 uppercase">Paid in Full</span>
          </div>
        </div>

        {/* Invoice Body */}
        <div className="p-8 space-y-8">
          {/* Customer Details */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Customer Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100 text-sm">
              <div>
                <span className="text-xs text-gray-400 block">Customer Name</span>
                <strong className="text-gray-900 font-bold">{booking.name}</strong>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Email Address</span>
                <strong className="text-gray-900 font-bold">{booking.email}</strong>
              </div>
              <div>
                <span className="text-xs text-gray-400 block">Phone Number</span>
                <strong className="text-gray-900 font-bold">{booking.phone}</strong>
              </div>
            </div>
          </div>

          {/* Package Details */}
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Package Summary</h3>
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Reserved Tour Package</span>
                <strong className="text-gray-900 font-bold">{booking.tourTitle}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Partner Agency</span>
                <span className="text-blue-600 font-bold">{booking.agencyName || "TripSathi Official"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Travelers</span>
                <span className="text-gray-900 font-semibold">{booking.travelers} Persons</span>
              </div>
              {booking.discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-bold pt-2 border-t">
                  <span>Coupon Applied ({booking.couponCode})</span>
                  <span>-₹{booking.discountAmount}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-gray-200 text-base font-black text-gray-900">
                <span>Total Amount Paid</span>
                <span className="text-emerald-600 text-xl">₹{booking.totalPrice}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
            <Link
              to="/my-booking"
              className="text-xs font-bold text-gray-600 hover:text-gray-900 flex items-center gap-1"
            >
              <Home className="w-4 h-4" /> Go to My Bookings
            </Link>

            <PDFDownloadLink
              document={<InvoicePDF booking={booking} />}
              fileName={`TripSathi_Invoice_${booking.name}.pdf`}
            >
              {({ loading }) => (
                <button
                  disabled={loading}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 text-sm"
                >
                  <Download className="w-4 h-4" /> {loading ? "Preparing PDF..." : "Download Invoice PDF"}
                </button>
              )}
            </PDFDownloadLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
