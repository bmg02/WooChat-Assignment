document.addEventListener('DOMContentLoaded', () => {
    const chatRootElement = document.createElement('div');
    chatRootElement.id = 'chat-root-div';
    document.body.appendChild(chatRootElement);

    new WooChatClient(chatRootElement, {
        companyName: 'Hey there',
        messages: [
            { time: 1637242148000, text: 'If I understood your question correctly, you\'d like to toggle between a class being active and inactive, like adding / removing it, for example for a menu.', senderId: 'Mr. Gandhi' },
            { time: 1637242148300, text: 'I understood your question correctly', senderId: 'Mr. Gandhi' },
            { time: 1637243768000, text: 'I understood your question correctly and inactive, like adding / removing it, for example', senderId: 'Mr. Bhuvan' },
            { time: 1637243888000, text: 'I understood.', senderId: 'Mr. Gandhi' },
            { time: 1637244488000, text: 'your question correctly.', senderId: 'Mr. Gandhi' },
            { time: 1637244668000, text: 'Thank you.', senderId: 'Mr. Bhuvan' },
        ],
        userId: 'Mr. Gandhi'
    });
});

class WooChatClient {
    
    static isWindowActive = false;

    static messageIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><g fill="currentColor"><path d="M16 8c0 3.866-3.582 7-8 7a9.06 9.06 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234c-.2.032-.352-.176-.273-.362c.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7zM5 8a1 1 0 1 0-2 0a1 1 0 0 0 2 0zm4 0a1 1 0 1 0-2 0a1 1 0 0 0 2 0zm3 1a1 1 0 1 0 0-2a1 1 0 0 0 0 2z"/></g></svg>`;

    static closeIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><g fill="none"><path d="M6.225 4.811a1 1 0 0 0-1.414 1.414L10.586 12L4.81 17.775a1 1 0 1 0 1.414 1.414L12 13.414l5.775 5.775a1 1 0 0 0 1.414-1.414L13.414 12l5.775-5.775a1 1 0 0 0-1.414-1.414L12 10.586L6.225 4.81z" fill="currentColor"/></g></svg>`;
    
    constructor(parentDiv, { companyName, messages, userId }) {
        this.companyName = !!companyName ? companyName : [];
        this.messages = !!messages ? messages : [];
        this.userId = !!userId ? userId : [];
        this.parentDiv = !!parentDiv && parentDiv instanceof Node ? parentDiv : document.body;
        this.embedChatButton(this.parentDiv);
    }

    static appendToParent(htmlToAppend, parentNode) {
        if (parentNode instanceof Node) {
            if (htmlToAppend instanceof Node) {
                parentNode.appendChild(htmlToAppend); 
            }
            else {
                parentNode.innerHTML += htmlToAppend;
            }
        }
    }

    embedChatButton(parentNode) {
        const button = document.createElement('button');
        button.id = 'chat-button';
        button.className = 'chat-button add-box-shadow';
        button.innerHTML = WooChatClient.messageIconSvg;

        button.onclick = () => this.launchChatWindow();

        WooChatClient.appendToParent(button, parentNode);
    }

    static getTime(dateObj) {
        if (!!dateObj && typeof(dateObj) === 'object') {
            let hrs = dateObj.getHours();
            let minutes = dateObj.getMinutes();
            let ampm = hrs >= 12 ? 'PM' : 'AM';
            hrs %= 12;
            hrs = hrs ? hrs : 12;
            minutes = minutes < 10 ? '0' + minutes : minutes;
            return hrs + ':' + minutes + ' ' + ampm;
        }
        return '';
    }

    static embedChatScreen(companyName, parentDiv) {
    
        const renderInputField = () => {
            return `
                <div class='chat-input-div'>
                    <input id='chat-input' />
                    <div class='chat-input-buttons'>
                        <button onclick='alert("Coming soon.")'>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path d="M16.5 6v11.5c0 2.21-1.79 4-4 4s-4-1.79-4-4V5a2.5 2.5 0 0 1 5 0v10.5c0 .55-.45 1-1 1s-1-.45-1-1V6H10v9.5a2.5 2.5 0 0 0 5 0V5c0-2.21-1.79-4-4-4S7 2.79 7 5v12.5c0 3.04 2.46 5.5 5.5 5.5s5.5-2.46 5.5-5.5V6h-1.5z" fill="currentColor"/></svg>
                        </button>
                        <button>
                            <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><defs/><path d="M931.4 498.9L94.9 79.5c-3.4-1.7-7.3-2.1-11-1.2c-8.5 2.1-13.8 10.7-11.7 19.3l86.2 352.2c1.3 5.3 5.2 9.6 10.4 11.3l147.7 50.7l-147.6 50.7c-5.2 1.8-9.1 6-10.3 11.3L72.2 926.5c-.9 3.7-.5 7.6 1.2 10.9c3.9 7.9 13.5 11.1 21.5 7.2l836.5-417c3.1-1.5 5.6-4.1 7.2-7.1c3.9-8 .7-17.6-7.2-21.6zM170.8 826.3l50.3-205.6l295.2-101.3c2.3-.8 4.2-2.6 5-5c1.4-4.2-.8-8.7-5-10.2L221.1 403L171 198.2l628 314.9l-628.2 313.2z" fill="currentColor"/></svg>
                        </button>
                    </div>
                </div>
            `;
        }
    
        const containerHtml = `
            <div class='chat-container add-box-shadow'>
                <div class='chat-header'>
                    <button onClick='alert("Coming soon.")'>
                        <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M13.83 19a1 1 0 0 1-.78-.37l-4.83-6a1 1 0 0 1 0-1.27l5-6a1 1 0 0 1 1.54 1.28L10.29 12l4.32 5.36a1 1 0 0 1-.78 1.64z"/></svg>
                    </button>
                    <h4>${ companyName }</h4>
                </div>
                <div id='messages-list' class='chat-messages-container'></div>
                <div class='chat-input-container'>${ renderInputField() }</div>
                <div class='chat-powered-by'>Powered by WooChat</div>
            </div>`;
    
        WooChatClient.appendToParent(containerHtml, parentDiv);
    }

    static loadChatMessages(messages, userId) {
        if (!Array.isArray(messages)) messages = [];

        let htmlToRender = '';
        messages.forEach((msg, key) => {
            htmlToRender += `
                <div class='msg-div ${ msg.senderId == userId ? 'my-msg' : 'opponent-msg' }'>
                    <span class='time-span' style='align-self: ${
                        msg.senderId == userId ? 'flex-end' : 'flex-start'
                    }'>
                        ${
                            !!messages[key + 1] && (messages[key + 1].time - msg.time > 300000 && messages[key + 1].senderId != userId) ? '' : WooChatClient.getTime(new Date(msg.time))
                        }
                    </span>
                    <span class='msg-span'>${ msg.text }</span>
                    <span class='sender-span'>
                        ${
                            msg.senderId == userId ? '' : msg.senderId
                        }
                    </span>
                </div>
            `;
        });

        htmlToRender += `<div id='chat-note-div'></div>`;

        document.getElementById('messages-list').innerHTML = htmlToRender;
    }

    static setOffline() {
        document.getElementById('chat-note-div').innerHTML = 'We\'re offline right now. We have received your messages and will get back to you via email.';
    }

    static getChatButton() {
        return document.getElementById('chat-button');
    }

    static destroyPreviousWindow() {
        const chatContainer = document.getElementsByClassName('chat-container');
        if (chatContainer.length > 0) {
            chatContainer[0].remove();
        }
    }

    closeChatWindow() {
        document.getElementsByClassName('chat-container')[0].classList.add('closing-animation');
        const button = WooChatClient.getChatButton();
        button.onclick = () => this.launchChatWindow();
        button.innerHTML = WooChatClient.messageIconSvg;
        button.classList.remove('close-button');
    }
    
    launchChatWindow() {
        WooChatClient.destroyPreviousWindow();
        WooChatClient.embedChatScreen(this.companyName, this.parentDiv);
        WooChatClient.loadChatMessages(this.messages, this.userId);
        WooChatClient.setOffline();

        const button = WooChatClient.getChatButton();
        button.onclick = () => this.closeChatWindow();
        button.innerHTML = WooChatClient.closeIconSvg;
        button.classList.add('close-button');
    }
}