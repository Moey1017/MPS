using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;

namespace MPS.Hubs
{
    public class StoreHub:Hub
    {
        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
            await Clients.Caller.SendAsync("Message","Successfully connected");
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            await Clients.Caller.SendAsync("Message",  "Successfully disconnected");
            await base.OnDisconnectedAsync(exception);
        }

        public async Task SubscribeToStore()
        {
            await Clients.Caller.SendAsync("Message","Successfully subscribed");
        }

        public async Task UnsubscribeStore()
        {

            await Clients.Caller.SendAsync("Message",
            "Successfully unsubscribed");
        }
    }
}
