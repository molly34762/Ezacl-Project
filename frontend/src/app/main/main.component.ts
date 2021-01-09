import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/services/common.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  ip_form: any;
  domain = "none";
  iana_assignment: any;
  ip_address = "";
  number_prefixes = 0;
  prefix_details: any;
  prefix_information: any;
  rir_allocation: any;
  show_ipv4_modal: boolean;
  show_ipv6_modal: boolean;
  ipv4_addresses: any;
  ipv6_addresses: any;
  current_ip_address = "";

  constructor(
    private service: CommonService,
    private http: HttpClient
  ) {
  }

  ngOnInit(): void {
  }

  async get_information(): Promise<void> {
    const formData = new FormData();
    formData.append('ip_address', this.ip_address);
    //Check if valid address
    var expression = /((^\s*((([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5]))\s*$)|(^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$))/;

    if (expression.test(this.ip_address)) {
      var data;
      try {
        data = await this.service.create(formData).toPromise();
      } catch (err) {
        alert("Please enter a valid IPv4 or IPv6 address" + err);
        this.ip_address = "";
        return;
      }
      this.domain = data['domain'];
      this.iana_assignment = data['iana_assignment'];
      this.number_prefixes = data['number_prefixes'];
      this.prefix_details = data['prefix_details'];
      this.prefix_information = data['prefix_information'];
      this.rir_allocation = data['rir_allocation'];
      this.current_ip_address = this.ip_address;
      // Sort by ASN Number
      this.prefix_information = this.prefix_information.sort(function IHaveAName(a, b) { // non-anonymous as you ordered...
        return b.asn_number < a.asn_number ? 1 // if b should come earlier, push a to end
          : b.asn_number > a.asn_number ? -1 // if b should come later, push a to begin
            : 0;                   // a and b are equal
      });
      this.ip_address = "";
    }
    else {
      // bad IP
      alert("Please enter a valid IPv4 or IPv6 address");
      this.ip_address = "";
    }
  }

  view_ipv4_prefix(index) {
    this.show_ipv4_modal = true;
    this.ipv4_addresses = this.prefix_details[index]['ipv4_prefixes'];
    this.ipv4_addresses = this.ipv4_addresses.sort(function IHaveAName(a, b) { // non-anonymous as you ordered...
      return b.name < a.name ? 1 // if b should come earlier, push a to end
        : b.name > a.name ? -1 // if b should come later, push a to begin
          : 0;                   // a and b are equal
    });
  }
  hide_ipv4_modal() {
    this.show_ipv4_modal = false;
  }

  view_ipv6_prefix(index) {
    this.show_ipv6_modal = true;
    this.ipv6_addresses = this.prefix_details[index]['ipv6_prefixes'];
    this.ipv6_addresses = this.ipv6_addresses.sort(function IHaveAName(a, b) { // non-anonymous as you ordered...
      return b.name < a.name ? 1 // if b should come earlier, push a to end
        : b.name > a.name ? -1 // if b should come later, push a to begin
          : 0;                   // a and b are equal
    });
  }
  hide_ipv6_modal() {
    this.show_ipv6_modal = false;
  }
}


