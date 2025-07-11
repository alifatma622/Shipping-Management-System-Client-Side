import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../../Services/Order-Services/Order.service';
import { ActivatedRoute } from '@angular/router';
import { ReadOneOrderDTO } from '../../../Models/IOrder';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable'; // Install this if you want table support: npm install jspdf-autotable

@Component({
  selector: 'app-order-details',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
  orderDetails: ReadOneOrderDTO | null = null;
  orderId: number = 0;
  sections = [
    { title: 'General Information', key: 'general', open: true },
    { title: 'Customer Information',  key: 'customer', open: false },
    { title: 'Shipping Information', key: 'shipping', open: false },
    { title: 'Seller & Branch Information', key: 'seller', open: false },
  ];
  constructor(private _orderService: OrderService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.orderId = +this.route.snapshot.paramMap.get('id')!;
    this._orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.orderDetails = order;
      },
      error: (err) => {
        this.orderDetails = null;
        // handle error (could show a message)
      }
    });
  }

  toggleSection(section: any): void {
    section.open = !section.open;
  }

  printOrderDetails(): void {
    if (!this.orderDetails) return;
  
    const doc = new jsPDF();
    let y = 10;
  
    const addTitle = (text: string) => {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text(text, 105, y, { align: 'center' });
      y += 10;
    };
  
    const addSectionHeader = (text: string) => {
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(40, 40, 40);
      doc.text(text, 14, y);
      y += 7;
    };
  
    const addTextLine = (label: string, value: string | number | undefined) => {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`${label}: `, 14, y);
      doc.setFont('helvetica', 'bold');
      const textValue =
        typeof value === 'number'
          ? this.formatNumber(value)
          : String(value ?? '');
      doc.text(textValue, 60, y);
      y += 6;
    };
  
    const formatBoolean = (val: boolean | undefined) =>
      val === true ? 'Yes' : val === false ? 'No' : '';
  
    // Title
    addTitle('Order Info');
  
    // General Info
    addSectionHeader('General Information');
    addTextLine('Order ID', this.orderDetails.orderID);
    addTextLine('Date', new Date(this.orderDetails.creationDate).toLocaleDateString());
    addTextLine('Status', this.orderDetails.status);
    addTextLine('Order Type', this.orderDetails.orderType);
  
    addTextLine('___________________________', '');

    // Customer Info
    addSectionHeader('Customer Information');
    addTextLine('Name', this.orderDetails.customerName);
    addTextLine('Phone', this.orderDetails.customerPhone);
    addTextLine('Address', this.orderDetails.address);
    addTextLine('City', this.orderDetails.customerCityName);
  
    addTextLine('___________________________', '');

    // Shipping Info
    addSectionHeader('Shipping Information');
    addTextLine('Agent', this.orderDetails.deliveryAgentName);
    addTextLine('To Village', formatBoolean(this.orderDetails.isShippedToVillage));
    addTextLine('Shipping Cost', this.orderDetails.shippingCost);
    addTextLine('Total Weight (kg)', this.orderDetails.totalWeight);
  
    addTextLine('___________________________', '');

    // Seller Info
    addSectionHeader('Seller & Branch Information');
    addTextLine('Seller', this.orderDetails.sellerName);
    addTextLine('Seller City', this.orderDetails.sellerCityName);
    addTextLine('Branch', this.orderDetails.branchName);
  
    addTextLine('___________________________', '');

    if (this.orderDetails.products?.length) {
      y += 5;
      autoTable(doc, {
        startY: y,
        head: [['Product Name', 'Price', 'Weight', 'Quantity']],
        body: this.orderDetails.products.map(p => [
          p.name,
          this.formatNumber(p.price),
          this.formatNumber(p.weight),
          p.quantity
        ]),
        styles: { fontSize: 10 },
        headStyles: { fillColor: [5, 88, 102] }, // #055866
      });
  
      y = (doc as any).lastAutoTable.finalY + 10;
    }
  
    // Totals
    const totalProductCost = this.orderDetails.products?.reduce(
      (sum, p) => sum + (p.price * p.quantity), 0
    ) ?? 0;
  
    const totalCost = totalProductCost + (this.orderDetails.shippingCost ?? 0);
  
    addSectionHeader('Totals');
    addTextLine('Total Product Cost', totalProductCost);
    addTextLine('Shipping Cost', this.orderDetails.shippingCost);
    addTextLine('Total Cost', totalCost);
  
    doc.save(`order-receipt-${this.orderDetails.orderID}.pdf`);
  }
  
  
  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-EG', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
  
  
}
