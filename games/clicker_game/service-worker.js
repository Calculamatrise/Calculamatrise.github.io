onmessage = function({ data }) {
    switch(data.cmd) {
        case "click":
            switch(data.args.clicks) {
                case 99:
                case 149:
                case 299:
                case 499:
                case 749:
                case 999:
                case 2499:
                case 4999:
                case 9999:
                    data.args.level++;
                break;
                    
                case 99999:
                    data.args.clicks = 0;
                    data.args.level = 1;
                    data.args.prestige++;
            }
            data.args.clicks += (data.args.prestige + 1);
        break;

        case "level":
            data.args.level++;
        break;

        case "prestige":
            data.args.prestige++;
        break;
    }
    this.postMessage(data);
}