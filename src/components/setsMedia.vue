<template>
    <div class="container">
        <div v-if="permission === 3">
            请使用 pc 端查看
        </div>
        <div v-else v-for="item in sets" :key="item.userId">
            <div class="user">
                <div class="name">{{ item.nickname }}</div>
            </div>
            <div class="competition-information">
                <div class="title">{{ title }}</div>
                <div class="count">{{ item.passCount }} / {{ total }}</div>
            </div>
            <div class="btn">
                <div class="downBtn" @click="downloadAsPDF">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
                        <path
                            d="M360-460h40v-80h40q17 0 28.5-11.5T480-580v-40q0-17-11.5-28.5T440-660h-80v200Zm40-120v-40h40v40h-40Zm120 120h80q17 0 28.5-11.5T640-500v-120q0-17-11.5-28.5T600-660h-80v200Zm40-40v-120h40v120h-40Zm120 40h40v-80h40v-40h-40v-40h40v-40h-80v200ZM320-240q-33 0-56.5-23.5T240-320v-480q0-33 23.5-56.5T320-880h480q33 0 56.5 23.5T880-800v480q0 33-23.5 56.5T800-240H320Zm0-80h480v-480H320v480ZM160-80q-33 0-56.5-23.5T80-160v-560h80v560h560v80H160Zm160-720v480-480Z" />
                    </svg>
                    PDF
                </div>
                <div class="downBtn" @click="downloadAsPNG">
                    <svg xmlns="http://www.w3.org/2000/svg" height="20px" viewBox="0 -960 960 960" width="20px">
                        <path
                            d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h560q33 0 56.5 23.5T840-760v560q0 33-23.5 56.5T760-120H200Zm0-80h560v-560H200v560Zm40-80h480L570-480 450-320l-90-120-120 160Zm-40 80v-560 560Z" />
                    </svg>
                    PNG
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    const props = defineProps({
        sets: Array,
        total: Number,
        permission: Number,
        title: String,
    });

    import html2canvas from "html2canvas";
    import { jsPDF } from "jspdf";
    import { toRefs } from "vue";

    const { certificateRef } = toRefs(props);

    async function captureCertificate() {
        let target = null;

        const hiddenContainer = document.getElementById('hidden-certificate-container');
        if (hiddenContainer) {
            const hiddenCertificate = hiddenContainer.querySelector('.certificate');
            if (hiddenCertificate) {
                target = hiddenCertificate;
            }
        }

        if (!target && certificateRef.value) {
            target = certificateRef.value?.$el || certificateRef.value;
        }

        if (!target) {
            console.error('无法找到certificate组件');
            return;
        }

        const pages = target.querySelectorAll('.certificate-container');
        const canvases = [];

        for (const page of pages) {
            const rawCanvas = await html2canvas(page, {
                scale: 3,
                useCORS: true,
                backgroundColor: "#ffffff"
            });

            const A4_WIDTH = 3508;
            const A4_HEIGHT = 2480;

            const scale = Math.min(A4_WIDTH / rawCanvas.width, A4_HEIGHT / rawCanvas.height);
            const finalWidth = rawCanvas.width * scale;
            const finalHeight = rawCanvas.height * scale;

            const finalCanvas = document.createElement("canvas");
            finalCanvas.width = finalWidth;
            finalCanvas.height = finalHeight;
            const ctx = finalCanvas.getContext("2d");
            ctx.drawImage(rawCanvas, 0, 0, finalWidth, finalHeight);

            canvases.push(finalCanvas);
        }

        return canvases;
    }

    async function downloadAsPNG() {
        const canvases = await captureCertificate();
        if (!canvases) return;

        canvases.forEach((canvas, index) => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = `certificate-${index + 1}.png`;
            link.click();
        });
    }

    async function downloadAsPDF() {
        const canvases = await captureCertificate();
        if (!canvases) return;

        const pdf = new jsPDF("l", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        canvases.forEach((canvas, index) => {
            if (index > 0) {
                pdf.addPage();
            }
            const imgData = canvas.toDataURL("image/png");
            pdf.addImage(imgData, "PNG", 0, 0, pageWidth, pageHeight);
        });

        pdf.save("certificate.pdf");
    }


</script>

<style scoped>
    .container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: var(--font-color);
        fill: var(--font-color);
    }

    .user {
        font-size: 20px;
        font-weight: 600;
        padding: 15px;
        display: flex;
        justify-content: center;
    }

    .competition-information {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .count {
        font-size: 20px;
        padding: 15px;
    }

    .title {
        width: 85%;
        line-height: 20px;
        text-align: center;
        padding: 20px;
    }

    .btn {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .downBtn {
        padding: 15px 20px;
        margin: 10px;
        cursor: pointer;
        transition: all 0.3s;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        background-color: var(--btn-bg);
        box-shadow: 0 0 2px var(--box-shadow-color);
        border-radius: 8px;
    }

    .downBtn:active {
        transform: scale(0.98);
        /* background-color: #f5f5f5; */
        color: #40a9ff;
        fill: #40a9ff;
    }
</style>